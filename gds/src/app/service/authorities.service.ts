import { Injectable } from '@angular/core';
import { AppService } from '../app.service';

@Injectable({
    providedIn: 'root'
})
export class AccessAndAuthorities {

    constructor(private appService: AppService) { }

    public getAllAuthorities(): Authorities {
        return Authorities;
    }

    public hasAccess(highLevelAuth: string, higherAuthType: HighLevelAuthorityType, lowerAuth: string | null = null, lowerAuthTyeps: LowerLevelAuthorityTyeps | null = null): boolean {
        let allowedAuthoritiesReduced = this.appService.getUserAuthorities().reduce((result, eachAuth) => result + "/" + eachAuth, "");
        let idealPermissions = [];
        let result = false;
        let ALL_AUTH = this.getAllAuthorities();
        let currentHighLevelAuth: any = ALL_AUTH["highLevelAuthority"][highLevelAuth];

        /* check if global permission exists or not */
        if (allowedAuthoritiesReduced.includes(currentHighLevelAuth.permission[0])) {
            return true;
        }

        if (higherAuthType === HighLevelAuthorityType.any) {
            /* if any permission exist within any of the lower level auth */
            return currentHighLevelAuth.mappers.some(eachLowerLevelAuth => {
                return this.hasAccess(highLevelAuth, HighLevelAuthorityType.specified, eachLowerLevelAuth, LowerLevelAuthorityTyeps.any)
            });
        } else {
            /* if the lower auth doesn't exist for the given higher auth then */
            lowerAuth = this.convertToCamelCase(lowerAuth);
            if (!lowerAuth || !lowerAuthTyeps || !currentHighLevelAuth.mappers.includes(lowerAuth)) {
                return false;
            }
            switch (lowerAuthTyeps) {
                case LowerLevelAuthorityTyeps.any:
                    idealPermissions = Object.values(ALL_AUTH[lowerAuth]);
                    idealPermissions = idealPermissions.flat();
                    result = idealPermissions.some(item => allowedAuthoritiesReduced.includes("/" + item));
                    return result;
                    break;
                case LowerLevelAuthorityTyeps.all:
                    idealPermissions = ALL_AUTH[lowerAuth].all.length || Object.values(ALL_AUTH[lowerAuth]);
                    break;
                default:
                    if (ALL_AUTH[lowerAuth].all.length) {
                        return true;
                    }
                    idealPermissions = ALL_AUTH[lowerAuth][lowerAuthTyeps];
                    break;
            }
            idealPermissions = idealPermissions.flat();
            result = idealPermissions.every(item => allowedAuthoritiesReduced.includes("/" + item));
            return result;
        }

    }

    convertToCamelCase(value = ""): string {
        if (value.match(/[a-z][A-Z]/))
            return value;
        else
            return value.toLowerCase().replace(/(-[a-z])/g, (x, y) => { return y.toUpperCase() }).replace("-", "");
    }


}

export enum HighLevelAuthoritiesKey {
    "MDM" = "mdm",
    "USER" = "user",
    "DATA_ENTRY" = "dataEntry",
    "DASHBOARD" = "dashboard",
    "REJECT_DATA" = "rejectData"
}

export interface HighLevelAuthorityModel {
    "mdm": HighLevelAuthorityDataType;
    "user": HighLevelAuthorityDataType;
    "dataEntry": HighLevelAuthorityDataType;
    "dashboard": HighLevelAuthorityDataType;
    "rejectData": HighLevelAuthorityDataType;
}

export interface HighLevelAuthorityDataType {
    key: string;
    permission: any[],
    mappers: any[]
}

export enum HighLevelAuthorityType {
    "specified" = "specified",
    "any" = "any",
}

export interface LowerLevelAuthoritiyModel {
    "create"?: any[AUTHORITY];
    "edit"?: any[AUTHORITY];
    "delete"?: any[AUTHORITY];
    "all": any[AUTHORITY];
    "resetPassword"?: any[AUTHORITY];
    "changePassword"?: any[AUTHORITY];
    "view"?: any[AUTHORITY];
}

export enum LowerLevelAuthorityTyeps {
    "any" = "any",
    "all" = "all",
    "create" = "create",
    "edit" = "edit",
    "delete" = "delete",
    "resetPassword" = "resetPassword",
    "changePassword" = "changePassword",
}


export enum AUTHORITY {
    MASTER_DATA_MANAGEMENT = "MASTER_DATA_MANAGEMENT",
    VIEW_DASHBOARD = "VIEW_DASHBOARD",
    COLLECT_DATA = "COLLECT_DATA",
    CREATE_DEPARTMENT = "CREATE_DEPARTMENT",
    UPDATE_DEPARTMENT = "UPDATE_DEPARTMENT",
    DELETE_DEPARTMENT = "DELETE_DEPARTMENT",
    CREATE_FREQUENCY = "CREATE_FREQUENCY",
    UPDATE_FREQUENCY = "UPDATE_FREQUENCY",
    DELETE_FREQUENCY = "DELETE_FREQUENCY",
    CREATE_DISTRICT = "CREATE_DISTRICT",
    UPDATE_DISTRICT = "UPDATE_DISTRICT",
    DELETE_DISTRICT = "DELETE_DISTRICT",
    CREATE_INDICATOR = "CREATE_INDICATOR",
    UPDATE_INDICATOR = "UPDATE_INDICATOR",
    DELETE_INDICATOR = "DELETE_INDICATOR",
    CREATE_ROLE = "CREATE_ROLE",
    UPDATE_ROLE = "UPDATE_ROLE",
    DELETE_ROLE = "DELETE_ROLE",
    CREATE_SCHEME = "CREATE_SCHEME",
    UPDATE_SCHEME = "UPDATE_SCHEME",
    DELETE_SCHEME = "DELETE_SCHEME",
    UPDATE_SDG_TARGET = "UPDATE_SDG_TARGET",
    CREATE_SOURCE = "CREATE_SOURCE",
    UPDATE_SOURCE = "UPDATE_SOURCE",
    DELETE_SOURCE = "DELETE_SOURCE",
    UPDATE_TARGET_VALUES = "UPDATE_TARGET_VALUES",
    CREATE_UNIT = "CREATE_UNIT",
    UPDATE_UNIT = "UPDATE_UNIT",
    DELETE_UNIT = "DELETE_UNIT",
    CREATE_USER = "CREATE_USER",
    UPDATE_USER = "UPDATE_USER",
    DELETE_USER = "DELETE_USER",
    CHANGE_PASSWORD = "CHANGE_PASSWORD",
    RESET_PASSWORD = "RESET_PASSWORD",
    USER_MGMT_ALL_API = "USER_MGMT_ALL_API",
    REJECT_DATA = "REJECT_DATA",
}

class Authorities {

    public static highLevelAuthority: HighLevelAuthorityModel = {
        mdm: { key: HighLevelAuthoritiesKey.MDM, permission: [AUTHORITY.MASTER_DATA_MANAGEMENT], mappers: ["department", "district", "unit", "source", "scheme", "indicator", "frequency", "sdgTarget", "targetValue", "user"] },
        user: { key: HighLevelAuthoritiesKey.USER, permission: [AUTHORITY.USER_MGMT_ALL_API], mappers: ["user",] },
        dataEntry: { key: HighLevelAuthoritiesKey.DATA_ENTRY, permission: [AUTHORITY.COLLECT_DATA], mappers: [] },
        dashboard: { key: HighLevelAuthoritiesKey.DASHBOARD, permission: [AUTHORITY.VIEW_DASHBOARD], mappers: [] },
        rejectData: { key: HighLevelAuthoritiesKey.REJECT_DATA, permission: [AUTHORITY.REJECT_DATA], mappers: [] },
    }

    /* All the below LowerLevelAuthoritiyModel should be mapped with atleast one HighLevelAuthorityModel with the 'mappers' property*/
    public static department: LowerLevelAuthoritiyModel = {
        "create": [AUTHORITY.CREATE_DEPARTMENT],
        "edit": [AUTHORITY.UPDATE_DEPARTMENT],
        "delete": [AUTHORITY.DELETE_DEPARTMENT],
        "all": []
    }
    public static role: LowerLevelAuthoritiyModel = {
        "create": [AUTHORITY.CREATE_ROLE],
        "edit": [AUTHORITY.UPDATE_ROLE],
        "delete": [AUTHORITY.DELETE_ROLE],
        "all": []
    };
    public static district: LowerLevelAuthoritiyModel = {
        "create": [AUTHORITY.CREATE_DISTRICT],
        "edit": [AUTHORITY.UPDATE_DISTRICT],
        "delete": [AUTHORITY.DELETE_DISTRICT],
        "all": []
    };
    public static unit: LowerLevelAuthoritiyModel = {
        "create": [AUTHORITY.CREATE_UNIT],
        "edit": [AUTHORITY.UPDATE_UNIT],
        "delete": [AUTHORITY.DELETE_UNIT],
        "all": []
    };
    public static source: LowerLevelAuthoritiyModel = {
        "create": [AUTHORITY.CREATE_SOURCE],
        "edit": [AUTHORITY.UPDATE_SOURCE],
        "delete": [AUTHORITY.DELETE_SOURCE],
        "all": []
    };
    public static frequency: LowerLevelAuthoritiyModel = {
        "create": [AUTHORITY.CREATE_FREQUENCY],
        "edit": [AUTHORITY.UPDATE_FREQUENCY],
        "delete": [AUTHORITY.DELETE_FREQUENCY],
        "all": []
    };
    public static sdgTarget: LowerLevelAuthoritiyModel = {
        "create": [],
        "edit": [AUTHORITY.UPDATE_SDG_TARGET],
        "delete": [],
        "all": []
    };
    public static scheme: LowerLevelAuthoritiyModel = {
        "create": [AUTHORITY.CREATE_SCHEME],
        "edit": [AUTHORITY.UPDATE_SCHEME],
        "delete": [AUTHORITY.DELETE_SCHEME],
        "all": []
    };
    public static indicator: LowerLevelAuthoritiyModel = {
        "create": [AUTHORITY.CREATE_INDICATOR],
        "edit": [AUTHORITY.UPDATE_INDICATOR],
        "delete": [AUTHORITY.DELETE_INDICATOR],
        "all": []
    };
    public static user: LowerLevelAuthoritiyModel = {
        "create": [AUTHORITY.CREATE_USER],
        "edit": [AUTHORITY.UPDATE_USER],
        "delete": [AUTHORITY.DELETE_USER],
        "resetPassword": [AUTHORITY.RESET_PASSWORD],
        "all": [AUTHORITY.USER_MGMT_ALL_API]
    };
    public static targetValue: LowerLevelAuthoritiyModel = {
        "create": [],
        "edit": [AUTHORITY.UPDATE_TARGET_VALUES],
        "delete": [],
        "all": []
    }
}