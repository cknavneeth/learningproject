import { AbstractControl,ValidationErrors } from "@angular/forms";

export function passwordMatchValidator(group:AbstractControl):ValidationErrors | null{
    const password=group.get('password')?.value
    const confirmpassword=group.get('confirmpassword')?.value

    return password==confirmpassword?null:{passwordMismatch:true}
}