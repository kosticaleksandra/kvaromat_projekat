import type { RezultatValidacije } from "../../types/validation/ValidationResult";

export function validacijaPodatakaAuth(korisnickoIme?: string, lozinka?: string): RezultatValidacije {
    if (!korisnickoIme || !lozinka) {
        return { uspesno: false, poruka: 'Morate uneti i korisnicko ime i lozinku.' };
    }

    if (korisnickoIme.length < 5) {
        return { uspesno: false, poruka: 'Korisničko ime mora imati bar 5 karaktera!' };
    }

    if (lozinka.length < 6) {
        return { uspesno: false, poruka: 'Lozinka mora da sadrzi bar 5 karaktera!' };
    }
    
    return { uspesno: true };
}
