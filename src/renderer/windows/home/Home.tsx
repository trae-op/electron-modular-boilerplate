import { Button } from "@components/Button";
import { Card } from "@components/Card";
import { Checkbox } from "@components/Checkbox";
import { LoadingSpinner } from "@components/LoadingSpinner";
import { Picture } from "@components/Picure";
import { Popup } from "@components/Popup";
import { RadioGroup } from "@components/RadioGroup";
import { Select } from "@components/Select";
import { TextField } from "@components/TextField";
import { LazyRender } from "@composites/LazyRender";
import {
  Provider as ProviderUpdater,
  UpdateSubscriber,
} from "@conceptions/Updater";
import { Provider as ProviderUser } from "@conceptions/User";
import { useClosePreloadWindow } from "@hooks/closePreloadWindow";
import {
  type CSSProperties,
  Suspense,
  lazy,
  useCallback,
  useMemo,
  useState,
} from "react";

const LazyTopPanel = lazy(() => import("./TopPanel"));
const LazyAutocompleteMultiple = lazy(
  () => import("../components/AutocompleteMultiple/AutocompleteMultiple"),
);

const items = [
  "One 1",
  "Two 2",
  "Three 3",
  "Four 4",
  "Five 5",
  "One 6",
  "Two 7",
  "Three 8",
  "Four 9",
  "Five 10",
  "One 11",
  "Two 12",
  "Three 13",
  "Four 14",
  "Five 15",
  "One 16",
  "Two 17",
  "Three 18",
  "Four 19",
  "Five 20",
  "One 21",
  "Two 22",
  "Three 23",
  "Four 24",
  "Five 25",
  "One 26",
  "Two 27",
  "Three 28",
  "Four 29",
  "Five 30",
  "One 31",
  "Two 32",
  "Three 33",
  "Four 34",
  "Five 35",
  "One 36",
  "Two 37",
  "Three 38",
  "Four 39",
  "Five 40",
  "One 41",
  "Two 42",
  "Three 43",
  "Four 44",
  "Five 45",
  "One 46",
  "Two 47",
  "Three 48",
  "Four 49",
  "Five 50",
  "One 51",
  "Two 52",
  "Three 53",
  "Four 54",
  "Five 55",
  "One 56",
  "Two 57",
  "Three 58",
  "Four 59",
  "Five 60",
  "One 61",
  "Two 62",
  "Three 63",
  "Four 64",
  "Five 65",
  "One 66",
  "Two 67",
  "Three 68",
  "Four 69",
  "Five 70",
  "One 71",
  "Two 72",
  "Three 73",
  "Four 74",
  "Five 75",
  "One 76",
  "Two 77",
  "Three 78",
  "Four 79",
  "Five 80",
  "One 81",
  "Two 82",
  "Three 83",
  "Four 84",
  "Five 85",
  "One 86",
  "Two 87",
  "Three 88",
  "Four 89",
  "Five 90",
  "One 91",
  "Two 92",
  "Three 93",
  "Four 94",
  "Five 95",
  "One 96",
  "Two 97",
  "Three 98",
  "Four 99",
  "Five 100",
];

const autoItems = [
  { value: "value1", label: "Member 1" },
  { value: "value2", label: "Admin 2" },
  { value: "value3", label: "Guest 3" },
  { value: "value4", label: "Member 4" },
  { value: "value5", label: "Admin 5" },
  { value: "value6", label: "Guest 6" },
  { value: "value7", label: "Member 7" },
  { value: "value8", label: "Admin 8" },
  { value: "value9", label: "Guest 9" },
  { value: "value10", label: "Member 10" },
  { value: "value11", label: "Admin 11" },
  { value: "value12", label: "Guest 12" },
  { value: "value13", label: "Member 13" },
  { value: "value14", label: "Admin 14" },
  { value: "value15", label: "Guest 15" },
  { value: "value16", label: "Member 16" },
  { value: "value17", label: "Admin 17" },
  { value: "value18", label: "Guest 18" },
  { value: "value19", label: "Member 19" },
  { value: "value20", label: "Admin 20" },
  { value: "value21", label: "Guest 21" },
  { value: "value22", label: "Member 22" },
  { value: "value23", label: "Admin 23" },
  { value: "value24", label: "Guest 24" },
  { value: "value25", label: "Member 25" },
  { value: "value26", label: "Admin 26" },
  { value: "value27", label: "Guest 27" },
  { value: "value28", label: "Member 28" },
  { value: "value29", label: "Admin 29" },
  { value: "value30", label: "Guest 30" },
  { value: "value31", label: "Member 31" },
  { value: "value32", label: "Admin 32" },
  { value: "value33", label: "Guest 33" },
  { value: "value34", label: "Member 34" },
  { value: "value35", label: "Admin 35" },
  { value: "value36", label: "Guest 36" },
  { value: "value37", label: "Member 37" },
  { value: "value38", label: "Admin 38" },
  { value: "value39", label: "Guest 39" },
  { value: "value40", label: "Member 40" },
  { value: "value41", label: "Admin 41" },
  { value: "value42", label: "Guest 42" },
  { value: "value43", label: "Member 43" },
  { value: "value44", label: "Admin 44" },
  { value: "value45", label: "Guest 45" },
  { value: "value46", label: "Member 46" },
  { value: "value47", label: "Admin 47" },
  { value: "value48", label: "Guest 48" },
  { value: "value49", label: "Member 49" },
  { value: "value50", label: "Admin 50" },
  { value: "value51", label: "Guest 51" },
  { value: "value52", label: "Member 52" },
  { value: "value53", label: "Admin 53" },
  { value: "value54", label: "Guest 54" },
  { value: "value55", label: "Member 55" },
  { value: "value56", label: "Admin 56" },
  { value: "value57", label: "Guest 57" },
  { value: "value58", label: "Member 58" },
  { value: "value59", label: "Admin 59" },
  { value: "value60", label: "Guest 60" },
  { value: "value61", label: "Member 61" },
  { value: "value62", label: "Admin 62" },
  { value: "value63", label: "Guest 63" },
  { value: "value64", label: "Member 64" },
  { value: "value65", label: "Admin 65" },
  { value: "value66", label: "Guest 66" },
  { value: "value67", label: "Member 67" },
  { value: "value68", label: "Admin 68" },
  { value: "value69", label: "Guest 69" },
  { value: "value70", label: "Member 70" },
  { value: "value71", label: "Admin 71" },
  { value: "value72", label: "Guest 72" },
  { value: "value73", label: "Member 73" },
  { value: "value74", label: "Admin 74" },
  { value: "value75", label: "Guest 75" },
  { value: "value76", label: "Member 76" },
  { value: "value77", label: "Admin 77" },
  { value: "value78", label: "Guest 78" },
  { value: "value79", label: "Member 79" },
  { value: "value80", label: "Admin 80" },
  { value: "value81", label: "Guest 81" },
  { value: "value82", label: "Member 82" },
  { value: "value83", label: "Admin 83" },
  { value: "value84", label: "Guest 84" },
  { value: "value85", label: "Member 85" },
  { value: "value86", label: "Admin 86" },
  { value: "value87", label: "Guest 87" },
  { value: "value88", label: "Member 88" },
  { value: "value89", label: "Admin 89" },
  { value: "value90", label: "Guest 90" },
  { value: "value91", label: "Member 91" },
  { value: "value92", label: "Admin 92" },
  { value: "value93", label: "Guest 93" },
  { value: "value94", label: "Member 94" },
  { value: "value95", label: "Admin 95" },
  { value: "value96", label: "Guest 96" },
  { value: "value97", label: "Member 97" },
  { value: "value98", label: "Admin 98" },
  { value: "value99", label: "Guest 99" },
  { value: "value100", label: "Member 100" },
];

const Home = () => {
  const [textValue, setTextValue] = useState("Hello world");
  const [selectValue, setSelectValue] = useState("value1");
  const [isChecked, setIsChecked] = useState(true);
  const [radioValue, setRadioValue] = useState("value1");
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  useClosePreloadWindow("window:main");

  const handleOpenPopup = useCallback(() => {
    setIsPopupOpen(true);
  }, []);

  const handleClosePopup = useCallback(() => {
    setIsPopupOpen(false);
  }, []);

  const handlePictureLoad = useCallback(() => {
    // Example callback
  }, []);

  const handlePictureError = useCallback(() => {
    // Example callback
  }, []);

  const handleUpdateGallery = useCallback(() => {
    setSelectValue((previous) => {
      if (previous === "value1") {
        return "value2";
      }
      if (previous === "value2") {
        return "value3";
      }

      return "value1";
    });
  }, []);

  const isTextError = useMemo(() => textValue.trim().length === 0, [textValue]);

  return (
    <ProviderUpdater>
      <UpdateSubscriber />
      <ProviderUser>
        <Suspense fallback={<LoadingSpinner />}>
          <LazyTopPanel />
        </Suspense>
        <div className="flex flex-col">
          <div className="mt-16 w-full">
            <div className="gap-6 grid bg-white dark:bg-gray-900 shadow-sm p-6 border border-gray-200 dark:border-gray-700 rounded-xl">
              <div className="gap-6 grid md:grid-cols-2">
                <TextField
                  label="Text Field"
                  placeholder="Type something"
                  value={textValue}
                  onChange={(event) => setTextValue(event.target.value)}
                  isError={isTextError}
                  textError="This field is required"
                  dataTestId="home-text-field"
                />

                <Select
                  label="Age"
                  value={selectValue}
                  onChange={(event) => setSelectValue(event.target.value)}
                  items={[
                    { value: "value1", label: "18-25" },
                    { value: "value2", label: "26-35" },
                    { value: "value3", label: "36-45" },
                  ]}
                  dataTestId="home-select"
                />
              </div>

              <div className="gap-6 grid md:grid-cols-2">
                <Checkbox
                  label="I agree with the terms"
                  checked={isChecked}
                  onChange={(event) => setIsChecked(event.target.checked)}
                  dataTestId="home-checkbox"
                />

                <RadioGroup
                  name="role"
                  value={radioValue}
                  onChange={(event) => setRadioValue(event.target.value)}
                  items={[
                    { value: "value1", label: "Member" },
                    { value: "value2", label: "Admin" },
                    { value: "value3", label: "Guest" },
                  ]}
                  dataTestId="home-radio-group"
                />
              </div>

              <LazyAutocompleteMultiple items={autoItems} />
            </div>
          </div>

          <div className="mt-8 w-full">
            <div className="flex flex-col gap-3 bg-white dark:bg-gray-900 shadow-sm p-6 border border-gray-200 dark:border-gray-700 rounded-xl">
              <div className="flex justify-between items-start gap-4">
                <div>
                  <p className="font-semibold text-gray-900 dark:text-gray-100 text-sm">
                    Popup component
                  </p>
                  <p className="mt-1 text-gray-500 dark:text-gray-400 text-xs">
                    Reusable modal container example.
                  </p>
                </div>

                <Button onClick={handleOpenPopup}>Open modal</Button>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <p className="font-semibold text-gray-900 dark:text-gray-100 text-sm">
              LazyRender example
            </p>
            <div className="mt-2 h-48">
              <LazyRender
                itemCount={items.length}
                heightItemComponent={48}
                renderMessageNotFound={
                  <div className="p-4 text-gray-600 text-sm">No items</div>
                }
                itemData={{
                  items,
                }}
              >
                {({
                  index,
                  style,
                  itemData,
                }: {
                  index: number;
                  style: CSSProperties;
                  itemData?: { items?: string[] };
                }) => (
                  <div
                    style={style}
                    className="flex items-center px-4 border-b last:border-b-0"
                  >
                    {itemData?.items?.[index]}
                  </div>
                )}
              </LazyRender>
            </div>
          </div>

          <div className="mt-8 w-full">
            <Card
              componentContent={
                <div>
                  <p className="font-semibold text-gray-900 dark:text-gray-100 text-sm">
                    Picture component
                  </p>
                  <p className="mt-1 text-gray-500 dark:text-gray-400 text-xs">
                    Cached image with aspect-ratio and error fallback.
                  </p>
                </div>
              }
              componentPicture={
                <Picture
                  alt="Broken example"
                  src="https://mui.com/static/images/cards/paella.jpg"
                  onLoad={handlePictureLoad}
                  onError={handlePictureError}
                  classNameContainer="rounded-lg border border-gray-200 dark:border-gray-700"
                />
              }
              componentActions={
                <>
                  <Button onClick={handleUpdateGallery}>Refresh gallery</Button>
                </>
              }
            />
          </div>
        </div>

        <Popup open={isPopupOpen} onClose={handleClosePopup}>
          <div className="space-y-4">
            <div className="space-y-1">
              <p className="font-semibold text-gray-900 dark:text-gray-100 text-lg">
                Reusable popup
              </p>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                This popup can wrap any content and is easy to reuse across the
                app.
              </p>
            </div>

            <div className="flex justify-end gap-2">
              <Button
                color="secondary"
                variant="text"
                onClick={handleClosePopup}
              >
                Cancel
              </Button>
              <Button onClick={handleClosePopup}>Confirm</Button>
            </div>
          </div>
        </Popup>
      </ProviderUser>
    </ProviderUpdater>
  );
};

export default Home;
