import { trigger, state, style, transition, animate, group } from '@angular/animations';
import { environment } from '@src/environments/environment';

export class Constants {
  // public static get HOME_URL(): string { return "https://devserver.sdrc.co.in/scpstamilnadu/"; };
  // public static get HOME_URL(): string { return "http://localhost:8080/scpstamilnadu/"; };

  public static get HOME_URL(): string { return "/sdg/"; };
  public static get API_URL(): string { return "/sdg/api/"; };
  public static get CMS_URL(): string { return "/cms/"; }
  public static get SERVER_ERROR_MESSAGE(): string { return 'Server error'; }
  public static BASE_URL = environment.apiBaseUrl;


  public static defaultImage: string;

  public static get INDEX_COMPUTE_FOOT_NOTE(): string { return 'The basis of calculation of indices have changed from TBD' }

  static message: IMessages = {

    invalidPassword: "The password field should accept minimum 8 to maximum 13 characters and at least one uppercase, lowercase, numeric, special character",
    enterField: "Please Enter",
    downloadExcel: 'Successfully downloaded excel',
    downloadtopoJSON: 'Successfully downloaded topoJSONFile',
    uploadExcel: 'Successfully uploaded excel',
    password: 'The password field should accept minimum 8 to maximum 13 characters and at least one uppercase, lowercase, numeric, special character ',
    passwordMatch: 'New Password and Confirm Password didn\'t match',
    email: 'Please enter valid email in the formart example@email.domain',
    textFiledRegex: 'Spaces are not allowed at beginning',
    form: "form is not valid",
    frequency: "Sum of Data Collection Days and Data Rejection Days should not exceed 28 DAYS",
    usernameRegx: "Pleasae enter valid user name without space",
    noSpace: "Space are not allowed",
    number: "input type must be number 0-9",
    loggedOut: "You have been successfully logged out"
  }

  public static goalColours = {
    "INDEX": { color1: "#62c1db", color2: "#97d8e7", color3: "#c5f7ff", color4: "#d9ebdb" },
    "Goal 1": { color1: "#e5243b", color2: "#f0545f", color3: "#f48289", color4: "#f7a5a9" },
    "Goal 2": { color1: "#DDA63A", color2: "#f7bb41", color3: "#fbca82", color4: "#fbd6a6" },
    "Goal 3": { color1: "#4C9F38", color2: "#83c55f", color3: "#a1d18f", color4: "#d8ebd1" },
    "Goal 4": { color1: "#C5192D", color2: "#e53d4a", color3: "#eb4e59", color4: "#ec6c74" },
    "Goal 5": { color1: "#FF3A21", color2: "#F45140", color3: "#f16050", color4: "#f58f82" },
    "Goal 6": { color1: "#26BDE2", color2: "#7ed2f0", color3: "#a1ddf4", color4: "#bee5f7" },
    "Goal 7": { color1: "#FCC30B", color2: "#fcce73", color3: "#fddaa0", color4: "#fde5bf" },
    "Goal 8": { color1: "#A21942", color2: "#a5375c", color3: "#a34d69", color4: "#a56f83" },
    "Goal 9": { color1: "#FD6925", color2: "#f47c58", color3: "#fd947a", color4: "#feb4a6" },
    "Goal 10": { color1: "#DD1367", color2: "#f63e7d", color3: "#f76c93", color4: "#f890a9" },
    "Goal 11": { color1: "#FD9D24", color2: "#fdae6a", color3: "#fdc094", color4: "#fed2b7" },
    "Goal 12": { color1: "#BF8B2E", color2: "#e2a745", color3: "#f5b54b", color4: "#f9c683" },
    "Goal 13": { color1: "#3F7E44", color2: "#4c9652", color3: "#5aaf61", color4: "#6ed476" },
    "Goal 14": { color1: "#0A97D9", color2: "#48a8de", color3: "#6bbcf9", color4: "#96cbfb" },
    "Goal 15": { color1: "#56C02B", color2: "#7be55b", color3: "#7ce75b", color4: "#90fa73" },
    "Goal 16": { color1: "#00689D", color2: "#0085c7", color3: "#00a4f5", color4: "#77bfff" },
    "Goal 17": { color1: "#19486A", color2: "#276896", color3: "#3b92d1", color4: "#75b8f5" }
  }

  public static goalShortNames = {
    "GOAL_1": "No Poverty",
    "GOAL_2": "Zero Hunger",
    "GOAL_3": "Good Health and Well-being",
    "GOAL_4": "Quality Education",
    "GOAL_5": "Gender Equality",
    "GOAL_6": "Clean Water and Sanitation",
    "GOAL_7": "Affordable and Clean Energy",
    "GOAL_8": "Decent Work and Economic Growth",
    "GOAL_9": "Industry, Innovation and Infrastructure",
    "GOAL_10": "Reduced Inequalities",
    "GOAL_11": "Sustainable Cities and Communities",
    "GOAL_12": "Responsible Consumption and Production",
    "GOAL_13": "Climate Action",
    "GOAL_14": "Life Below Water",
    "GOAL_15": "Life On Land",
    "GOAL_16": "Peace, Justice and Strong Institutions",
    "GOAL_17": "Partnerships For The Goals",
  }
  public static goalDescriptions = {
    "GOAL_1": "End poverty in all its forms everywhere",
    "GOAL_2": "End hunger, achieve food security and improved nutrition and promote sustainable agriculture",
    "GOAL_3": "Ensure healthy lives and promote well-being for all at all ages",
    "GOAL_4": "Ensure inclusive and equitable quality education and promote lifelong learning opportunities for all",
    "GOAL_5": "Achieve gender equality and empower all women and girls",
    "GOAL_6": "Ensure availability and sustainable management of water and sanitation for all",
    "GOAL_7": "Ensure access to affordable, reliable, sustainable and modern energy for all",
    "GOAL_8": "Promote sustained, inclusive and sustainable economic growth, full and productive employment and decent work for all",
    "GOAL_9": "Build resilient infrastructure, promote inclusive and sustainable industrialization and foster innovation",
    "GOAL_10": "Reduce inequality within and among countries",
    "GOAL_11": "Make cities and human settlements inclusive, safe, resilient and sustainable",
    "GOAL_12": "Ensure sustainable consumption and production patterns",
    "GOAL_13": "Take urgent action to combat climate change and its impacts",
    "GOAL_14": "Conserve and sustainably use the oceans, seas and marine resources for sustainable development",
    "GOAL_15": "Protect, restore and promote sustainable use of terrestrial ecosystems, sustainably manage forests, combat desertification, and halt and reverse land degradation and halt biodiversity loss",
    "GOAL_16": "Promote peaceful and inclusive societies for sustainable development, provide access to justice for all and build effective, accountable and inclusive institutions at all levels",
    "GOAL_17": "Strengthen the means of implementation and revitalize the Global Partnership for Sustainable Development",
  }

  public static fadeAnimation = [
    // the fade-in/fade-out animation.
    trigger('simpleFadeAnimation', [

      // the "in" style determines the "resting" state of the element when it is visible.
      state('in', style({ opacity: 1 })),

      // fade in when created. this could also be written as transition('void => *')
      transition(':enter', [
        style({ opacity: 0 }),
        animate(600)
      ]),

      // fade out when destroyed. this could also be written as transition('void => *')
      transition(':leave',
        animate(600, style({ opacity: 0 })))
    ])
  ]

  public static SlideDownAnimation = [
    trigger('slideInOut', [
      state('in', style({ height: '*', opacity: 0 })),
      transition(':leave', [
        style({ height: '*', opacity: 1 }),

        group([
          animate(300, style({ height: 0 })),
          animate('200ms ease-in-out', style({ 'opacity': '0' }))
        ])

      ]),
      transition(':enter', [
        style({ height: '0', opacity: 0 }),

        group([
          animate(300, style({ height: '*' })),
          animate('500ms ease-in-out', style({ 'opacity': '1' }))
        ])

      ])
    ])
  ];


  public static SlideUpAnimation = [
    trigger('slideUpIn', [
      state('in', style({ height: '*', opacity: 0 })),
      transition(':leave', [
        style({ top: '0' }),

        group([
          animate(1000, style({ top: '100%' })),
        ])

      ]),
      transition(':enter', [
        style({ top: '100%', opacity: 1 }),

        group([
          animate(1000, style({ top: '0' })),
          animate('500ms ease-in-out', style({ 'opacity': '1' }))
        ])

      ])
    ])
  ];

  public static SlideRightAnimation = [
    trigger('slideRightLeft', [
      state('in', style({ width: '*', opacity: 0 })),
      transition(':leave', [
        style({ width: '*', opacity: 1 }),

        group([
          animate(600, style({ width: 0 })),
          animate('400ms ease-in-out', style({ 'opacity': '0' }))
        ])

      ]),
      transition(':enter', [
        style({ width: '0', opacity: 1 }),

        group([
          animate(600, style({ width: '*' })),
          animate('1000ms ease-in-out', style({ 'opacity': '1' }))
        ])

      ])
    ])
  ];

  public static formConstants = {
    formArray: "formArray",
    formGroup: "formGroup",
    formControl: "formControl"
  }

  public static buttonTypeConst = {
    POSITIVE: "success",
    NEUTRAL: "secondary",
    NEGATIVE: "danger"
  }

  public static modalPopupConst = {
    SUCCESS: "success",
    ERROR: "error",
    CONFIRM: "confirm"
  }

  public static toastStatus = {
    SUCCESS: "success",
    ERROR: "error",
    WARN: "warn",
    Alert: "alert"
  }

  public static toastType = {
    MODAL: "MODAL",
    NOTIFICATION: "NOTIFICATION"
  }

  public static regularExp = {
    passwordRegx: /^(?!.*[\s])(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,13}$/g,
    // passwordRegx:/(?!.*[\s])(?=.*[a-zA-z])(?=.*\d)(?=.*[#$^+=!*()@%&]).{8,13}$/g,
    usernameRegx: /^\s*$/g,
    noSpace: /^\S*$/g,
    noWhiteSpaceAtBegining: /^[^.\s]/,
    username: /^[a-z0-9_-]{3,15}$/g,
    email: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  }

  static toolTip: ToolTip = {
    downloadTopoJSON: "Download Map",
    showWebView: "Show Web View",
    showExcelView: "Show Excel View"
  }
}

