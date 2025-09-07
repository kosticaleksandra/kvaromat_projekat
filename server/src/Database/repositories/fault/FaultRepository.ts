import { ResultSetHeader, RowDataPacket } from "mysql2/promise";
import db from "../../connections/DbConnectionPool";
import { IFaultRepository } from "../../../Domain/repositories/fault/IFaultRepository";
import { Fault } from "../../../Domain/models/Fault";
import { FaultDto } from "../../../Domain/DTOs/fault/FaultDto";
import type { FaultStatus } from "../../../Domain/types/FaultStatus";

function mapRowToDto(row: any): FaultDto {
  const raw = row.price ?? row.cena ?? null;
  const price = raw == null ? 0 : Number(raw);

  return new FaultDto(
    row.id,
    row.userId,
    row.name,
    row.description,
    row.imageUrl,
    row.status,
    row.createdAt,
    row.comment ?? null,
    price
  );
}

export class FaultRepository implements IFaultRepository {
async create(fault: Fault): Promise<FaultDto> {
  try {
    const sql = `
      INSERT INTO faults (userId, commentId, name, description, imageUrl, status, createdAt) 
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const [res] = await db.execute<ResultSetHeader>(sql, [
      fault.userId,
      fault.commentId,
      fault.name,
      fault.description,
      fault.imageUrl,
      fault.status,
      fault.createdAt,
    ]);

    if (res.insertId) {
      return await this.getById(res.insertId);
    }
    return new FaultDto();
  } catch (err) {
    console.error("Error creating fault:", err);
    return new FaultDto();
  }
}


  async getById(id: number): Promise<FaultDto> {
    try {
      const sql = `
        SELECT f.*, c.comment, c.price
        FROM faults f
        LEFT JOIN comments c ON f.commentId = c.id
        WHERE f.id = ?
      `;
      const [rows] = await db.execute<RowDataPacket[]>(sql, [id]);
      return rows.length ? mapRowToDto(rows[0]) : new FaultDto();
    } catch (err) {
      console.error("Error getting fault by ID:", err);
      return new FaultDto();
    }
  }

  async getByStatus(status: FaultStatus): Promise<FaultDto[]> {
    try {
      const sql = `
        SELECT f.*, c.comment, c.price
        FROM faults f
        LEFT JOIN comments c ON f.commentId = c.id
        WHERE f.status = ?
      `;
    const [rows] = await db.execute<RowDataPacket[]>(sql, [status]);
      return rows.map(mapRowToDto);
    } catch (err) {
      console.error("Error fetching faults by status:", err);
      return [];
    }
  }

  async getAll(): Promise<FaultDto[]> {
    try {
      const sql = `
        SELECT f.*, c.comment, c.price
        FROM faults f
        LEFT JOIN comments c ON f.commentId = c.id
        ORDER BY f.id ASC
      `;
      const [rows] = await db.execute<RowDataPacket[]>(sql);
      return rows.map(mapRowToDto);
    } catch (err) {
      console.error("Error fetching all faults:", err);
      return [];
    }
  }


async update(fault: Fault): Promise<FaultDto> {
  try {
    const sql = `
      UPDATE faults
      SET description = ?, status = ?, imageUrl = ?
      WHERE id = ?
    `;
    const [res] = await db.execute<ResultSetHeader>(sql, [
      fault.description,
      fault.status,
      fault.imageUrl,
      fault.id,
    ]);

    return res.affectedRows > 0 ? await this.getById(fault.id) : new FaultDto();
  } catch (err) {
    console.error("Error updating fault:", err);
    return new FaultDto();
  }
}


  async getFaultsByUser(userId: number): Promise<FaultDto[]> {
    try {
      const sql = `
        SELECT f.*, c.comment, c.price
        FROM faults f
        LEFT JOIN comments c ON f.commentId = c.id
        WHERE f.userId = ?
        ORDER BY f.createdAt DESC
      `;
      const [rows] = await db.execute<RowDataPacket[]>(sql, [userId]);
      return rows.map(mapRowToDto);
    } catch (err) {
      console.error("Error fetching user faults:", err);
      return [];
    }
  }

  
  async updateFaultStatus(faultId: number, status: FaultStatus): Promise<FaultDto> {
    try {
      const sql = `UPDATE faults SET status = ? WHERE id = ?`;
      const [res] = await db.execute<ResultSetHeader>(sql, [status, faultId]);

      return res.affectedRows > 0 ? await this.getById(faultId) : new FaultDto();
    } catch (err) {
      console.error("Error updating fault status:", err);
      return new FaultDto();
    }
  }

  async getAllFaultsWithComments(): Promise<FaultDto[]> {
    try {
      const sql = `
        SELECT f.*, c.comment, c.price
        FROM faults f
        LEFT JOIN comments c ON f.commentId = c.id
        ORDER BY f.createdAt DESC
      `;
      const [rows] = await db.execute<RowDataPacket[]>(sql);
      return rows.map(mapRowToDto);
    } catch (err) {
      console.error("Error fetching all faults with comments:", err);
      return [];
    }
  }

  async resolveFault(
    faultId: number,
    status: string,
    comment: string,
    price: number
  ): Promise<FaultDto> {
    const hasGetConn = typeof (db as any).getConnection === "function";
    const conn: any = hasGetConn ? await (db as any).getConnection() : db;
    const hasTx = typeof conn.beginTransaction === "function";

    try {
      if (hasTx) await conn.beginTransaction();

      const [ins] = (await conn.execute(
        "INSERT INTO comments (comment, price) VALUES (?, ?)",
        [comment, price]
      )) as [ResultSetHeader, unknown];

      const commentId = ins.insertId;

      await conn.execute(
        "UPDATE faults SET status = ?, commentId = ? WHERE id = ?",
        [status, commentId, faultId]
      );

      if (hasTx) await conn.commit();

      return await this.getById(faultId);
    } catch (err) {
      if (hasTx && typeof conn.rollback === "function") await conn.rollback();
      console.error("Error resolveFault:", err);
      return new FaultDto();
    } finally {
      if (hasGetConn && typeof conn.release === "function") conn.release();
    }
  }


  async setReaction(
    faultId: number,
    userId: number,
    reaction: "like" | "dislike" | "love"
  ): Promise<void> {
    await db.execute(
      `INSERT INTO fault_reactions (faultId, userId, kind)
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE kind = VALUES(kind), updatedAt = CURRENT_TIMESTAMP`,
      [faultId, userId, reaction]
    );
  }
  async deleteReaction(faultId: number, userId: number): Promise<void> {
    await db.execute(
      `DELETE FROM fault_reactions WHERE faultId = ? AND userId = ?`,
      [faultId, userId]
    );
  }

  async getReactionCounts(
    faultId: number
  ): Promise<{ like: number; dislike: number; love: number }> {
    const [rows] = await db.execute<RowDataPacket[]>(
      `SELECT kind, COUNT(*) AS cnt
         FROM fault_reactions
        WHERE faultId = ?
     GROUP BY kind`,
      [faultId]
    );
    const counts: any = { like: 0, dislike: 0, love: 0 };
    for (const r of rows as any[]) counts[r.kind] = Number(r.cnt);
    return counts;
  }
  async getUserReaction(
    faultId: number,
    userId: number
  ): Promise<"like" | "dislike" | "love" | null> {
    const [rows] = await db.execute<RowDataPacket[]>(
      `SELECT kind FROM fault_reactions WHERE faultId = ? AND userId = ? LIMIT 1`,
      [faultId, userId]
    );
    return (rows as any[])[0]?.kind ?? null;
  }
}

export default FaultRepository;
