import { Circular } from "./CircularProgress";
import { DownloadedButton } from "./DownloadedButton";
import { Message } from "./Message";
import { UpdateSubscriber } from "./UpdateSubscriber";

export const Window = () => {
  return (
    <div className="flex flex-col items-center gap-4">
      <UpdateSubscriber />
      <Message className="text-center" />
      <Circular />
      <DownloadedButton className="w-full sm:w-auto">
        Update downloaded
      </DownloadedButton>
    </div>
  );
};
