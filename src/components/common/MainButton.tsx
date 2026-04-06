import { forwardRef, ReactElement } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import Image from "next/image";

type MainButtonProps = {
  text: string;
  form?: string;
  isLoading?: boolean;
  action?: () => void;
  isSubmitable?: boolean;
  disabled?: boolean;
  width?: "full_width" | string;
  dataLoadingText?: string;
  variant?: "primary" | "secondary" | "outline";
  classes?: string;
  iconRoute?: string;
  rightIconRoute?: string;
  rightIconClass?: string;
  iconComponent?: ReactElement;
  size?: "small" | "normal" | "large";
};

const MainButton = forwardRef<HTMLButtonElement, MainButtonProps>(
  (
    {
      text,
      isLoading = false,
      form,
      action,
      disabled = false,
      isSubmitable,
      width,
      dataLoadingText = "Please wait ...",
      variant = "primary",
      classes,
      iconRoute,
      rightIconRoute,
      rightIconClass = "w-[24px] h-[24px]",
      iconComponent,
      size = "normal",
    },
    ref
  ) => {
    const propWidth = width === "full_width" ? "w-full" : width ? width : "w-auto";

    const sizeClasses = {
      small: "h-[2.5rem] px-4 text-xs",
      normal: "h-[3rem] px-6 text-sm",
      large: "h-[3.75rem] px-8 text-base",
    };

    const variantClasses = {
      primary: "bg-[#1A362B] text-white hover:bg-[#1A362B]/90 shadow-lg shadow-[#1A362B]/20",
      secondary: "bg-[#EFEBE3] text-[#1A362B] hover:bg-[#EFEBE3]/80 border border-[#1A362B]/10",
      outline: "bg-transparent text-[#1A362B] border-2 border-[#1A362B]/20 hover:border-[#1A362B]/40 hover:bg-[#1A362B]/5",
    };

    const baseClasses = `${propWidth} ${sizeClasses[size]} ${variantClasses[variant]} 
      font-bold uppercase tracking-[0.1em] rounded-lg transition-all duration-300 
      flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed
      ${classes || ""}`;

    if (isLoading) {
      return (
        <Button
          className={baseClasses}
          ref={ref}
          disabled
          type="button"
        >
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>{dataLoadingText}</span>
        </Button>
      );
    }

    return (
      <Button
        form={form}
        className={baseClasses}
        onClick={!disabled ? action : () => undefined}
        type={isSubmitable ? "submit" : "button"}
        ref={ref}
        disabled={disabled}
      >
        {iconRoute && (
          <>
            <Image 
              src={iconRoute} 
              alt="left button icon" 
              width={20} 
              height={20} 
              className="opacity-70"
            />
          </>
        )}
        {iconComponent}
        <span>{text}</span>
        {rightIconRoute && (
          <Image
            src={rightIconRoute}
            alt="right button icon"
            width={20}
            height={20}
            className={`${rightIconClass} opacity-70`}
          />
        )}
      </Button>
    );
  }
);

MainButton.displayName = "MainButton";

export default MainButton;