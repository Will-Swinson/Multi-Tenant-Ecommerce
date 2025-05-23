import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";

export default function Home() {
  return (
    <div className="p-4">
      <div className="flex flex-col gap-y-4">
        <div>
          <Button variant="elevated">I AM A BUTTON</Button>
        </div>
        <div>
          <Input placeholder="I AM A INPUT" />
        </div>
        <div>
          <Progress value={50} />
        </div>
        <div>
          <Textarea defaultValue="I AM A TEXTAREA" />
        </div>
        <div>
          <Checkbox />
        </div>
      </div>
    </div>
  );
}
