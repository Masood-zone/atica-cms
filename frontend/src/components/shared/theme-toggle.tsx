import { useId, useState } from "react";
import { MoonIcon, SunIcon } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "../ui/theme-provider";

const ThemeButtonMode = () => {
  const id = useId();
  const [checked, setChecked] = useState(true);
  const { setTheme, theme } = useTheme();
  const toggleSwitch = () => {
    setChecked(!checked);
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <div
      className="group inline-flex items-center gap-2"
      data-state={checked ? "checked" : "unchecked"}
    >
      <span
        id={`${id}-light`}
        className="group-data-[state=checked]:text-muted-foreground/70 cursor-pointer text-left text-sm font-medium"
        aria-controls={id}
        onClick={() => {
          setChecked(false);
          setTheme("light");
        }}
      >
        <SunIcon className="size-4" aria-hidden="true" />
      </span>
      <Switch
        id={id}
        checked={checked}
        onCheckedChange={toggleSwitch}
        aria-labelledby={`${id}-dark ${id}-light`}
        aria-label="Toggle between dark and light mode"
      />
      <span
        id={`${id}-dark`}
        className="group-data-[state=unchecked]:text-muted-foreground/70 cursor-pointer text-right text-sm font-medium"
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
