import { Constants } from '@src/app/constants';
import { FormControl } from '@angular/forms';

export class MDMBase {
    TOOL_TIP: ToolTip = Constants.toolTip;
    ERROR_MESSAGE = Constants.message;

    getTextFieldErrors(fc: FormControl, field) {
        let errorMSG = [];
        fc.hasError("required") ? errorMSG.push('Please provide ' + field.label) : '';
        fc.hasError("pattern") ? errorMSG.push(this.getPatternError(fc.getError('pattern').requiredPattern)) : '';
        fc.hasError("maxlength") ? errorMSG.push(field.label + ' should be maximum ' + fc.getError("maxlength").requiredLength + ' character') : '';
        fc.hasError("minlength") ? errorMSG.push(field.label + ' should be minimum ' + fc.getError("minlength").requiredLength + ' character') : '';
        fc.hasError("whiteSpace") ? errorMSG.push('Blank space are not allowed') : '';
        fc.hasError("password") ? errorMSG.push(this.ERROR_MESSAGE.password) : '';
        fc.hasError("passwordMatch") ? errorMSG.push(this.ERROR_MESSAGE.passwordMatch) : '';
        fc.hasError("min") ? errorMSG.push(field.label + ` should be minimum ${field.min || 1}`) : '';
        fc.hasError("max") ? errorMSG.push(field.label + ' should be maximum ' + field.max) : '';
        fc.hasError("email") ? errorMSG.push(this.ERROR_MESSAGE.email) : '';
        return errorMSG[0];
    }

    getPatternError(pattern) {
        let errorMessage = '';
        Object.keys(regExps).some(eachKey => {
            regExps[eachKey] && regExps[eachKey].toString() === pattern ? errorMessage = this.ERROR_MESSAGE[eachKey] : ''
            return pattern === regExps[eachKey];
        });
        return errorMessage;
    }
}

export const regExps: { [key: string]: RegExp } = {
    videoRegex: /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$|^(?:https?:\/\/)?(?:www\.)?dailymotion.com\/(video|hub)+(\/([^_]+))?[^#]*(‪#‎video‬=([^_&]+))?$|^(?:https?:\/\/)?(?:www\.)?vimeo.com\/([0-9]+)$/,
    textFiledRegex: /^[^.\s]/,
    noWhiteSpaceAtBegining: /^[^.\s]/,
    number: /[\d]{1,}/,
    usernameRegx: /^\S*[a-z0-9_-]{3,15}$/g,
    noSpace: /^\S*$/g,
};