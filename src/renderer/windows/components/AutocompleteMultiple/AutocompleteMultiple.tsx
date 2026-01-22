import { Autocomplete } from "@components/Autocomplete";
import type {
  TAutocompleteChangeValue,
  TAutocompleteOption,
  TAutocompleteRenderOptionProps,
} from "@components/Autocomplete/types";
import { Checkbox } from "@components/Checkbox";
import { Popover } from "@components/Popover";
import { TextField } from "@components/TextField";
import { LazyRender } from "@composites/LazyRender";
import { cn } from "@utils/classes";
import { type ReactNode, memo, useState } from "react";

const AutocompleteMultiple = memo(
  ({ items }: { items: TAutocompleteOption[] }) => {
    const [favoriteValues, setFavoriteValues] = useState<TAutocompleteOption[]>(
      [items[0]],
    );

    const handleFavoriteValues = (value: TAutocompleteChangeValue) => {
      if (Array.isArray(value)) {
        setFavoriteValues(value);
      }
    };

    return (
      <Autocomplete
        className="w-full"
        multiple
        value={favoriteValues}
        options={items}
        disableCloseOnSelect
        getOptionLabel={(option) => option.label}
        onChange={handleFavoriteValues}
        renderOptions={(params) => (
          <Popover
            anchorEl={params.anchorEl}
            onClose={params.closeList}
            open={params.open && !params.disabled}
            className="p-2"
          >
            <div className="w-72">
              <LazyRender
                itemCount={params.filteredOptions.length}
                heightItemComponent={40}
                heightContainer={
                  params.filteredOptions.length > 0
                    ? Math.min(params.filteredOptions.length * 40, 250)
                    : 40
                }
                renderMessageNotFound={
                  <div className="p-2 text-gray-500 text-sm">
                    {params.noOptionsText}
                  </div>
                }
                itemData={{
                  options: params.filteredOptions,
                  isSelected: params.isSelected,
                  handleSelectOption: params.handleSelectOption,
                  renderOptionContent: params.renderOptionContent,
                }}
              >
                {({ index, style, itemData }) => {
                  const data = itemData as {
                    options: TAutocompleteOption[];
                    isSelected: (option: TAutocompleteOption) => boolean;
                    handleSelectOption: (option: TAutocompleteOption) => void;
                    renderOptionContent: (
                      props: TAutocompleteRenderOptionProps,
                      option: TAutocompleteOption,
                      state: { selected: boolean },
                    ) => ReactNode;
                  };

                  const option = data.options[index];
                  const selected = data.isSelected(option);

                  const optionProps: TAutocompleteRenderOptionProps = {
                    key: option.value,
                    role: "option",
                    "aria-selected": selected,
                    className: cn(
                      "flex justify-between items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-700 px-3 py-2 rounded-md text-gray-800 dark:text-gray-100 text-sm transition-colors duration-150 cursor-pointer",
                      selected
                        ? "bg-blue-50 text-blue-700 dark:bg-blue-900/30"
                        : "",
                      option.disabled ? "cursor-not-allowed opacity-60" : "",
                    ),
                    "data-option-value": option.value,
                    "data-option-disabled": option.disabled
                      ? "true"
                      : undefined,
                  };

                  const handleSelectOption = () => {
                    if (!option.disabled) {
                      data.handleSelectOption(option);
                    }
                  };

                  return (
                    <div
                      key={option.value}
                      style={style}
                      onClick={handleSelectOption}
                    >
                      {data.renderOptionContent(optionProps, option, {
                        selected,
                      })}
                    </div>
                  );
                }}
              </LazyRender>
            </div>
          </Popover>
        )}
        renderOption={(optionProps, option, { selected }) => {
          const { key, ...rest } = optionProps;

          return (
            <li key={key} {...rest}>
              <Checkbox
                label={option.label}
                checked={selected}
                readOnly
                className="pointer-events-none"
              />
            </li>
          );
        }}
        renderInput={(params) => {
          const { inputClassName: _inputClassName, ...textFieldProps } = params;

          return (
            <TextField
              {...textFieldProps}
              label="Favorites"
              placeholder="Choose your favorites"
              containerClassName="w-full"
              className="bg-transparent px-0 border-0 focus:border-transparent focus:ring-0"
              dataTestId="home-autocomplete-input"
            />
          );
        }}
      />
    );
  },
);

export default AutocompleteMultiple;
