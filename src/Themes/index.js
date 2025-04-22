import { createTheme, responsiveFontSizes } from "@mui/material/styles";
import { themeOptions } from "../Themes/typography";

const baseOptions = {
  palette: {
    primary: {
      main: "#000000", // Customize this color as needed
    },
    secondary: {
      main: "#626262", // Customize this color as needed
    },

    background: {
      main: "#080031", // Customize this color as needed
    },
    text: {
      primary: "#FFFFFF",
      secondary: "#FFFFFFCC",
    },

    // Add more color definitions as needed
  },
  components: {
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          backgroundColor: "rgba(122, 105, 254, 0.25)",
        },
      },
    },
    MuiTableContainer: {
      styleOverrides: {
        root: {
          background: "#FFFFFF !important",
          borderRadius: "12px",
          boxShadow: "0px 0px 20px 0px #0000000D !important",
          borderBottom: "1px solid rgb(224 224 224 / 47%) !important",
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          width: "200px",
          backgroundColor: "#fff",
          boxShadow:
            "0px 8px 10px -5px rgba(0,0,0,0.2),0px 16px 24px 2px rgba(0,0,0,0.14),0px 6px 30px 5px rgba(0,0,0,0.12)",
        },
        paperAnchorDockedLeft: {
          borderRight: "0",
        },
      },
    },

    MuiIconButton: {
      styleOverrides: {
        root: {
          fontSize: "20px",
          color: "#FFFFFF !important",
          // background: "#1C1C23 ",
          padding: "12px",
          width: "40px",
          height: "40px",
        },
      },
    },
    MuiPaginationItem: {
      styleOverrides: {
        root: {
          color: "#000",
          "&.Mui-selected": {
            borderRadius: "50px",
            border: "1px solid #2752E7",
            background: "#2752e7bd",
            color: "#fff",
          },
          "&.Mui-selected:hover": {
            background: "#2752E7",
            color: "#fff",
          },
        },
      },
    },
    MuiTablePagination: {
      styleOverrides: {
        root: {
          color: "#000",
        },
        // select: {
        //   padding: "0px 10px !important",
        // },
      },
    },
    MuiSelect: {
      styleOverrides: {
        select: {
          background: "transparent",
          position: "relative",
          border: "1px solid #FFFFFF0D",
          color: "#FFFFFFBF",
          padding: "0px",
          "&:focus": {
            borderColor: "#FFFFFF", // Example: change border color on focus
            outline: "none", // Remove default outline
            backgroundColor: "#000",
          },
        },
      },
    },
    MuiTableHead: {
      root: {
        // background: "rgba(255, 255, 255, 0.01)",
        borderTop: "1px solid #636262",
        "&:hover": {
          backgroundColor: "none",
        },
      },
    },
    MuiTableBody: {
      styleOverrides: {
        // root: {
        //   background: "rgba(255, 255, 255, 0.03)",
        // },
      },
    },
    MuiTable: {
      styleOverrides: {
        // root: {
        //   background: "rgba(255, 255, 255, 0.03)",
        // },
      },
    },
    MuiTableRow: {
      root: {
        // borderBottom: "1px solid #636262",
        // "&:hover": {
        //   backgroundColor: "#ffffff14",
        // },
        //

        "&:last-child": {
          borderBottom: "none",
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          // padding: "22px 10px",
          fontWeight: 600,
          fontSize: 12,
          color: "#000 !important",
          whiteSpace: "pre",
        },
        body: {
          padding: "10px 25px",
          color: "#FFFFFFBF",
          wordBreak: "break-word",
          fontSize: 12,
          fontWeight: 400,
          borderBottom: "1px solid #FFFFFF08",
        },
        root: {
          padding: "10px 25px",
          color: "#000000BF !important",
          background: "transparent",
          borderBottom: "1px solid rgba(224, 224, 224, 1) !important",
        },
      },
    },
    MuiAccordion: {
      styleOverrides: {
        root: {
          padding: "0px",
          border: "none",
        },
      },
    },
    MuiSwitch: {
      styleOverrides: {
        switchBase: {
          left: "5px",
        },
        track: {
          backgroundColor: "#0000001A",
          opacity: "1.38",
          height: "20px",
          borderRadius: "25px",
        },
        thumb: {
          background: "linear-gradient(90deg, #2752E7 0%, #4B82EF 100%)",

          width: "16px",
          height: "16px",
          marginTop: "5px",
        },
        root: {
          width: "61px",
          height: "43px",
        },
      },
    },
    MuiFormLabel: {
      styleOverrides: {
        root: { color: "#222" },
        colorSecondary: {
          "&.Mui-focused": {
            color: "#222",
          },
        },
      },
    },
    MuiFormHelperText: {
      styleOverrides: {
        root: { marginLeft: "0px" },
      },
    },
    MuiListSubheader: {
      styleOverrides: {
        root: {
          color: "#000000",
          fontSize: "22px",
          fontWeight: "600",
          lineHeight: "33px",
        },
      },
    },
    MuiSvgIcon: {
      styleOverrides: {
        root: {
          color: "#000",
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        inputMultiline: {
          padding: "1px !important",
        },
        root: {
          borderRadius: "12px",
          // background: "transparent",
          position: "relative",
          // border: "1px solid #FFFFFF0D",
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            // border: "1px solid #FFFFFF0D",
            boxShadow: "none",
          },
        },
        notchedOutline: {
          borderColor: "none",
          background: "rgba(255, 255, 255, 0.05)",
          borderWidth: "0px",
        },
        input: {
          color: "#000",
          padding: "16px",
          fontSize: "16px",
          fontWeight: "400",
          background: "transparent !important",
          "&:-webkit-autofill": {
            "-webkit-background-clip": "text !important",
            // transitionDelay: "9999s",
            "caret-color": "transparent",
            "-webkit-box-shadow": "0 0 0 100px transparent inset",
            "-webkit-text-fill-color": "#fff",
          },
          "&:-internal-autofill-selected": {
            color: "#000",
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        outlined: {
          padding: "20px",
          width: "100%",
        },
        elevation1: {
          background: "#FFFFFF",
          borderRadius: "20px",
          padding: "30px",
          boxShadow: "0px 5px 14.9px 0px #00000033",
        },
        elevation2: {
          position: "relative",
          zIndex: "999",
          padding: "20px",
          borderRadius: "12px",
          background: "#ffffff",
          boxShadow: "0px 0px 20px 0px #0000001A",
          "@media(max-width:767px)": {
            padding: "10px !important",
          },
        },
        elevation3: {
          padding: "0px",
          background: "transparent",
          borderRadius: "0px",
          position: "relative",
          border: "none",
          boxShadow: "none",
        },
        root: {
          boxShadow: "none",
          color: "#fff",
          width: "auto",
          // '&.MuiAccordion-root .MuiCollapse-wrapper': {
          //   marginTop: "20px !important",
          // },
          "&.MuiAccordion-root": {
            backgroundColor: "none !important",
            background: "none !important",
          },
          "&.MuiAccordion-root.Mui-expanded:last-of-type": {
            background: "none !important",
            backgroundColor: "none !important", 
          },
        },
      },
    },

    MuiPopover: {
      styleOverrides: {
        root: {
          zIndex: 99999,
        },
        paper: {
          background: "rgba(255, 255, 255, 0.03)",
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          alignItems: "self-start",
        },
        gutters: {
          paddingLeft: 0,
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: "rgba(255, 255, 255, 0.40)",
        },
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          padding: "4px",
          fontSize: "12px",
          color: "#000000CC",
        },
        colorSecondary: {
          "&.Mui-checked": { color: "#000" },
        },
      },
    },
    MuiFormControlLabel: {
      styleOverrides: {
        root: {
          paddingBottom: "0",
        },
      },
    },
    MuiFormControl: {
      styleOverrides: {
        root: {
          paddingLeft: "0px !important",
        },
      },
    },
    MuiListItemSecondaryAction: {
      styleOverrides: {
        root: {
          right: 0,
        },
      },
    },
    MuiDialogContent: {
      styleOverrides: {
        root: {
          padding: "0px",
          borderTop: "none",
          borderBottom: "none",
        },
      },
    },
    MuiSlider: {
      styleOverrides: {
        root: {
          height: "10px",
        },
        track: {
          backgroundColor: "#2752E7",
          border: "1px solid #2752E7",
        },
        thumb: {
          backgroundColor: "#2752E7",
        },
        rail: {
          backgroundColor: "#BCBCBC",
        },
        mark: {
          display: "none",
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paperScrollPaper: {
          Width: 450,
          maxWidth: "100%",
        },

        paper: {
          backgroundColor: "#ffffff !important",
          overflow: "auto",
          position: "relative",
          borderRadius: "16px",
          padding: "20px",
          backdropFilter: "blur(50px)",

          "@media(max-width:767px)": {
            margin: "16px",
            padding: "10px",
          },
        },
        paperWidthSm: {
          maxWidth: "500px !important",
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          position: "relative",
          border: "1px solid #0000000D",
          borderRadius: "8px",
          padding: "10px",
          background: "#0000000D",
    
          "&::before": {
            left: "0",
            bottom: "0",
            content: '""',
            position: "absolute",
            right: "0",
            WebkitTransition:
              "border-bottom-color 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
            transition:
              "border-bottom-color 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
            pointerEvents: "none",
          },
          "&::after": {
            borderBottom: "none !important",
            left: "0",
            bottom: "0",
            content: '""',
            position: "absolute",
            right: "0",
            WebkitTransform: "scaleX(0)",
            MozTransform: "scaleX(0)",
            MsTransform: "scaleX(0)",
            transform: "scaleX(0)",
            WebkitTransition:
              "-webkit-transform 200ms cubic-bezier(0.0, 0, 0.2, 1) 0ms",
            transition: "transform 200ms cubic-bezier(0.0, 0, 0.2, 1) 0ms",
            pointerEvents: "none",
          },
        },
        input: {
          fontSize: 14,
          fontWeight: 400,
          color: "#000000", // user input text
          lineHeight: "20px",
          "&::placeholder": {
            color: "#888888", // placeholder color
            opacity: 1,
          },
        },
      },
    },
    
    MuiBackdrop: {
      styleOverrides: {
        root: { backgroundColor: "rgba(0, 0, 0, 0.75)" },
      },
    },
    MuiAutocomplete: {
      styleOverrides: {
        paper: {
          padding: "0px !important",
          backgroundColor: "#000", // Change the background color here
        },
        tag: {
          backgroundColor: "#000",
        },
        inputRoot: {
          maxHeight: "46px",
          padding: "5px",
        },
        option: {
          color: "#fff",
          fontSize: "14px !important",
          fontWeight: "400",
          lineHeight: "18px",
          letterSpacing: "0px",
          textAlign: "left",
        },
        input: {
          width: "0",
          color: "#fff",
          fontSize: "13px !important",
          fontWeight: "400",
        },
      },
    },
    MuiButton: {
      root: {
        background: "red",
        textTransform: "capitalize",
        "&:hover": {
          textDecoration: "none",
          backgroundColor: "none",
          // border: "1px solid rgba(255, 255, 255, 0.60)",
        },
      },
      styleOverrides: {
        containedSecondary: {
          color: "#FFFFFF",
          padding: "14.7px 40px",
          textTransform: "capitalize",
          fontSize: "14px",
          fontWeight: "500",
          borderRadius: "11.06px",
          fontFamily: "'Outfit', sans-serif",
          background: "#FFFFFF0D",
          lineHeight: "21.71px",
          border: "1px solid #FFFFFF1A",
          boxShadow: "none",
          "&:hover": {
            boxShadow: "none",
            color: "#FFFFFF",
            background: "linear-gradient(180deg, #806DFF 0%, #4A33E7 100%)",
          },

          "&[disabled]": {
            backgroundColor: "#2752e75c",
            cursor: "not-allowed",
            pointerEvents: "auto",
          },
        },

        sizeLarge: {
          padding: "14.7px 55px",
          fontSize: "14px",
        },

        sizeSmall: {
          padding: "8px 30px",
          fontSize: "14px",
        },
        containedPrimary: {
          color: "#FFFFFF",
          padding: "7.7px 30px",
          textTransform: "capitalize",
          fontSize: "14px",
          fontWeight: "400",
          borderRadius: "100px",
          fontFamily: '"Inter", sans-serif',
          background: "#2752E7",
          lineHeight: "23.36px",
          boxShadow: "none",
          border: "1px solid #2752E7",
          "&:hover": {
            border: "1px solid #2752E7",
            color: "#2752E7",
            background: "#FFFFFF",
          },

          "&[disabled]": {
            backgroundColor: "#2752e75c",
            cursor: "not-allowed",
            pointerEvents: "auto",
          },
        },
        outlinedPrimary: {
          borderRadius: "100px",
          color: "#000000",
          whiteSpace: "pre",
          fontSize: "14px",
          fontWeight: "400",
          lineHeight: "23.36px",
          fontFamily: '"Inter", sans-serif',
          padding: "7.7px 50px",
          border: "1px solid #2752E7 !important",
          "&:hover": {
            border: "1px solid #2752E7 !important",
            color: "#FFFFFF",
            background: "#2752E7",
          },
        },
        outlinedSecondary: {
          color: "#000000",
          padding: "12.7px 40px",
          textTransform: "capitalize",
          fontSize: "16px",
          fontWeight: "600",
          borderRadius: "52px",
          border: "1px solid #0000001A",
          background: "transparent",
          lineHeight: "20px",
          height: "52.38px !important",
          "&:hover": {
            color: "#000000",
            background: "#80EC00",
          },
          "@media (max-width: 780px)": {
            padding: "10px 20px",
          },
        },
      },
    },

   
    MuiSelect: {
      styleOverrides: {
        icon: {
          color: "#757575", // Dropdown arrow
        },
        root: {
          background: "#0000000D !important",
          position: "relative",
          border: "1px solid #0000000D",
          color: "#000000", // This affects label/input text
          padding: "0px",
          borderRadius: "8px",
    
          // This targets the actual selected value text
          '& .MuiSelect-select': {
            paddingLeft: "30px",
            // textAlign: "left",
            color: "#000000", // Ensures selected value is black
          },
        },
      },
    },
    
    MuiMenu: {
      styleOverrides: {
        list: {
          outline: "0",
          background: "#000",
          boxShadow: "0px 0px 53px rgba(0, 0, 0, 0.25)",
          borderRadius: "8px",
          backdropFilter: "blur(40px)",
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: { paddingLeft: "20px" },
      },
    },
    MuiModal: {
      styleOverrides: {
        backdrop: {
          background: "transparent !important",
        },
      },
    },

    MuiToolbar: {
      styleOverrides: {
        root: {
          // padding: "0px 65px !important",
          "@media (max-width: 780px)": {
            // padding: "0px 16px !important",
          },
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          textDecoration: "none !important",
          cursor: "pointer",
        },
      },
    },
    MuiDateCalendar: {
      styleOverrides: {
        root: {
          backgroundColor: "#636363",
          color: "#fff",
          "& .MuiPickersArrowSwitcher-button": {
            // backgroundColor: "transparent !important",
            // color: "#000 !important",
          },
          "& .MuiPickersCalendarHeader-switchViewButton": {
            backgroundColor: "transparent !important",
            color: "#000 !important",
            marginLeft: "-15px !important",
          },
          "& .css-1jsy6pn-MuiButtonBase-root-MuiPickersDay-root:not(.Mui-selected)":
            {
              color: "#fff !important",
              backgroundColor: "#000 !important",
              border: "none !important",
              borderRadius: "10px !important",
            },
          "& .MuiPaper-root-MuiPickersPopper-paper": {
            background: "#000 !important",
          },
          "& .Mui-selected": {
            backgroundColor: "#2752E7 !important",
            color: "#fff !important",
            border: "none !important",
            borderRadius: "10px !important",
          },
          "& .MuiPickersCalendarHeader-root": {
            paddingLeft: "30px",
          },
          "& .MuiDayCalendar-slideTransition": {
            minHeight: "210px !important",
          },
          "& .MuiPickersCalendarHeader-labelContainer": {
            fontSize: "15px",
          },
        },
      },
    },
  },
};

export const createCustomTheme = (config = {}) => {
  let theme = createTheme({ ...baseOptions, ...themeOptions });

  if (config.responsiveFontSizes) {
    theme = responsiveFontSizes(theme);
  }

  return theme;
};
