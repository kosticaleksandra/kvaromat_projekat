import { Router, Request, Response } from "express";
import { IAuthService } from "../../Domain/services/auth/IAuthService";
import { validacijaPodatakaAuth } from "../validators/auth/AuthRequestValidator";
import jwt from "jsonwebtoken";

export class AuthControler {
  private router: Router;
  private authUser: IAuthService;

  constructor(authService: IAuthService) {
    this.router = Router();
    this.authUser = authService;
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post("/auth/login", this.prijava.bind(this));
    this.router.post("/auth/register", this.registracija.bind(this));
  }

  private async prijava(req: Request, res: Response): Promise<void> {
    try {
      const { username, email, password } = req.body ?? {};
      const ident = (username ?? email ?? "").toString().trim();

      const valid = validacijaPodatakaAuth(ident, password);
      if (!valid.uspesno) {
        res.status(400).json({ success: false, message: valid.poruka ?? "Nedostaju podaci" });
        return;
      }

      const result = await this.authUser.prijava(ident, password);

      if (!result || !result.id) {
        res.status(401).json({ success: false, message: "Neispravno korisničko ime ili lozinka" });
        return;
      }

      const secret = process.env.JWT_SECRET;
      if (!secret) {
        res.status(500).json({ success: false, message: "JWT_SECRET nije podešen" });
        return;
      }

      const token = jwt.sign(
        {
          id: result.id,
          korisnickoIme: result.username,
          uloga: result.role,
        },
        secret,
        { expiresIn: "6h" }
      );

      res.status(200).json({ success: true, message: "Uspešna prijava", data: token });
    } catch (error) {
      console.error("AUTH /login error:", error);
      res.status(500).json({ success: false, message: "Desila se greška na serveru" });
    }
  }

  private async registracija(req: Request, res: Response): Promise<void> {
    try {
      const { imePrezime, username, password, role } = req.body ?? {};

      const valid = validacijaPodatakaAuth(username, password);
      if (!valid.uspesno) {
        res.status(400).json({ success: false, message: valid.poruka ?? "Nedostaju podaci" });
        return;
      }

      const result = await this.authUser.registracija(imePrezime, username, role, password);

      if (!result || !result.id) {
        res
          .status(401)
          .json({ success: false, message: "Registracija nije uspela. Korisničko ime možda već postoji." });
        return;
      }

      const secret = process.env.JWT_SECRET;
      if (!secret) {
        res.status(500).json({ success: false, message: "JWT_SECRET nije podešen" });
        return;
      }

      const token = jwt.sign(
        {
          id: result.id,
          korisnickoIme: result.username,
          uloga: result.role,
        },
        secret,
        { expiresIn: "6h" }
      );

      res.status(201).json({ success: true, message: "Uspešna registracija", data: token });
    } catch (error) {
      console.error("AUTH /register error:", error);
      res.status(500).json({ success: false, message: "Desila se greška na serveru" });
    }
  }

  public getRouter(): Router {
    return this.router;
  }
}
