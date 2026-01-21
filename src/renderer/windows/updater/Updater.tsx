import { Window } from "@conceptions/Updater";
import { Provider as ProviderUpdater } from "@conceptions/Updater";

const Updater = () => {
  return (
    <ProviderUpdater>
      <Window />
    </ProviderUpdater>
  );
};

export default Updater;
