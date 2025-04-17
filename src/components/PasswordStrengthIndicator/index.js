import { Box, Typography } from "@mui/material";
import { IoMdCheckmark } from "react-icons/io";
import { BsExclamationCircle } from "react-icons/bs";
import { RiCloseCircleLine } from "react-icons/ri";

export const SecurePassword = ({ password, isPassword }) => {
  const getPasswordStrengthColor = () => {
    const hasLowerCase = /[a-z]/.test(password);
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialCharacter = /[!@#$%^&*()\-_=+{}[\]|;:'",.<>/?]/.test(
      password
    );
    const length = password.length;
    return {
      length: length,
      hashLength: length >= 8,
      hasLowerCase: hasLowerCase,
      hasUpperCase: hasUpperCase,
      hasNumber: hasNumber,
      hasSpecialCharacter: hasSpecialCharacter,
    };
  };

  const strength = getPasswordStrengthColor();
  return (
    <Box
      pt={2}
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "5px",
        alignItems: "flex-start",
      }}
    >
      {strength?.length <= 18 ? (
        <FeatureListItem
          item={`Must be at least 8 characters long`}
          isStrong={strength?.hashLength}
          crossed={false}
        />
      ) : (
        <FeatureListItem
          item={`Must be less than or equal to 18 characters long`}
          isStrong={!strength?.hashLength}
          crossed={true}
        />
      )}
      <FeatureListItem
        item={`Must contain an uppercase (A-Z)`}
        isStrong={strength?.hasUpperCase}
      />
      <FeatureListItem
        item={`Must contain a lowercase letter (a-z)`}
        isStrong={strength?.hasLowerCase}
        crossed={false}
      />
      <FeatureListItem
        item={`Must contain a number`}
        isStrong={strength?.hasNumber}
        crossed={false}
      />
      <FeatureListItem
        item={`Must contain a special character (!, @, #, %, etc.)`}
        isStrong={strength?.hasSpecialCharacter}
        crossed={false}
      />
      {isPassword && (
        <FeatureListItem item={isPassword} isStrong={true} crossed={true} />
      )}
    </Box>
  );
};

const FeatureListItem = ({ item, isStrong, crossed }) => {
  return (
    <Box>
      {item && item && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
            "& p": {
              fontSize: "12px",
              color: crossed ? "red" : !isStrong ? "#626262" : "green",
            },
            "& svg": {
              fontSize: "16px",
              color: crossed ? "red" : !isStrong ? "#626262" : "green",
            },
          }}
        >
          {crossed ? (
            <Box className="featureCheck">
              <RiCloseCircleLine />
            </Box>
          ) : isStrong ? (
            <Box className="featureCheck">
              <IoMdCheckmark />
            </Box>
          ) : (
            <Box className="featureCheck" sx={{ transform: "rotate(180deg)" }}>
              <BsExclamationCircle />
            </Box>
          )}

          <Typography
            color="secondary"
            variant="body2"
            sx={{
              marginLeft: "10px",
            }}
          >
            {item}
          </Typography>
        </Box>
      )}
    </Box>
  );
};
