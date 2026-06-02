import { useId, useState } from "react";
import { MoonIcon, SunIcon } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "../ui/theme-provider";

const ThemeButtonMode = () => {
  const id = useId();
  const [checked, setChecked] = useState(false);
  const { setTheme, theme } = useTheme();
  const toggleSwitch = () => {
    setChecked(!checked);
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <div
      className="group inline-flex items-center gap-2"
      data-state={checked ? "checked" : "unchecked"}
    >
      {/* Light */}
      <span
        id={`${id}-light`}
        className="group-data-[state=checked]:text-muted-foreground/70 cursor-pointer text-left text-sm font-medium"
        aria-controls={id}
        onClick={() => {
          setChecked(true);
          setTheme("light");
        }}
      >
        <SunIcon className="size-4" aria-hidden="true" />
      </span>

      <Switch
        id={id}
        checked={checked}
        onCheckedChange={toggleSwitch}
        aria-labelledby={`${id}-light ${id}-dark`}
        aria-label="Toggle between dark and light mode"
      />
      {/* Dark */}
      <span
        id={`${id}-dark`}
        className="group-data-[state=unchecked]:text-muted-foreground/70 cursor-pointer text-right text-sm font-medium "
        aria-controls={id}
        onClick={() => {
          setChecked(true);
          setTheme("dark");
        }}
      >
        <MoonIcon className="size-4" aria-hidden="true" />
      </span>
    </div>
  );
};

export default ThemeButtonMode;
