import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export default function HeaderToggle() {
  const [enabled, setEnabled] = useState(false);

  return (
    <div className="flex items-center gap-2 ml-auto pr-6">
      <Label
        htmlFor="mode-toggle"
        className={`cursor-pointer font-semibold transition-colors ${
          enabled ? "text-green-400" : "text-blue-400"
        }`}
      >
        {enabled ? "B2B" : "B2C"}
      </Label>
      <Switch
        id="mode-toggle"
        checked={enabled}
        onCheckedChange={setEnabled}
        className={`${
          enabled
            ? "bg-green-400 data-[state=checked]:bg-green-500"
            : "bg-blue-400 data-[state=unchecked]:bg-blue-500"
        }`}
      />
    </div>
  );
}
