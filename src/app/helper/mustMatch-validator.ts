import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

//Ham nhan 2 ten control ke thua thua validator
//dau ra la true hoac false
export function mustMatch(controlName: string, matchingControlName: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        //Show 2 contrl ra control nguon va dich
        const sourceCtrl = control.get(controlName);
        const matchingCtrl = control.get(matchingControlName);

        if (matchingCtrl?.errors && !matchingCtrl.errors['mustMatch']) {
            //Bo qua neu control kia da co loi khac
            return null;
        }
        //Kiem tra value co giong nhau hay k, neu giong nhau thi k co loi
        //Set loi tren matching control neu validation that bai
        if (sourceCtrl?.value !== matchingCtrl?.value) {
            //Dau ra la error neu k giong nhau
            matchingCtrl?.setErrors({ mustMatch: true });
            return { mustMatch: true };
        } else {
            matchingCtrl?.setErrors(null);
            return null;
        }
    };
}