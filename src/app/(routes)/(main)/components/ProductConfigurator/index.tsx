import { type ProductPropertyOption } from '@prisma/client';
import clsx from 'clsx';
import { useState } from 'react';

import { Label } from '@/app/components/form/Label';
import { RadioGroup, RadioGroupItem } from '@/app/components/form/RadioGroup';
import { ConfigurationOption } from '@/app/utils/cart';

import { Props } from './types';

export function ProductConfigurator({
  properties,
  onConfigurationChange,
  disabled = false,
}: Props) {
  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, ConfigurationOption>
  >({});

  // Helper function to check if an option is incompatible with current selection
  const isOptionIncompatible = (
    option: ProductPropertyOption & {
      incompatibleWith: ProductPropertyOption[];
      incompatibleWithMe: ProductPropertyOption[];
    },
  ) => {
    const selectedOptionIds = Object.values(selectedOptions).map(
      (opt) => opt.id,
    );
    return option.incompatibleWith.some((incompatible) =>
      selectedOptionIds.includes(incompatible.id),
    );
  };

  // Helper function to check if an option is out of stock
  const isOptionUnavailable = (
    option: ProductPropertyOption & {
      incompatibleWith: ProductPropertyOption[];
      incompatibleWithMe: ProductPropertyOption[];
    },
  ) => {
    return !option.hasStock || isOptionIncompatible(option);
  };

  const handleOptionSelect = (
    propertyId: string,
    optionId: string,
    propertyName: string,
    optionName: string,
  ) => {
    const newSelectedOptions = {
      ...selectedOptions,
      [propertyId]: {
        id: optionId,
        name: optionName,
        propertyName,
      },
    };
    setSelectedOptions(newSelectedOptions);
    onConfigurationChange(newSelectedOptions);
  };

  if (!properties.length) {
    return null;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-medium text-gray-900">Personalize</h2>
      <div className="space-y-8">
        {properties.map((property) => (
          <div key={property.id} className="flex flex-col gap-3">
            <Label className="text-base font-semibold">{property.name}</Label>
            <RadioGroup
              value={selectedOptions[property.id]?.id ?? ''}
              onValueChange={(value) => {
                const option = property.options.find((opt) => opt.id === value);
                if (option) {
                  handleOptionSelect(
                    property.id,
                    option.id,
                    property.name,
                    option.name,
                  );
                }
              }}
              disabled={disabled}
              className="grid grid-cols-1 sm:grid-cols-2 gap-3"
            >
              {property.options.map((option) => {
                const isUnavailable = isOptionUnavailable(option);
                const isSelected =
                  selectedOptions[property.id]?.id === option.id;

                return (
                  <div
                    key={option.id}
                    className={clsx(
                      'relative',
                      isUnavailable && 'cursor-not-allowed',
                    )}
                  >
                    <RadioGroupItem
                      checked={isSelected}
                      value={option.id}
                      id={option.id}
                      disabled={isUnavailable || disabled}
                      className="sr-only"
                    />
                    <Label
                      htmlFor={option.id}
                      className={clsx(
                        'flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-all duration-300',
                        isUnavailable
                          ? 'opacity-50 pointer-events-none'
                          : [
                              'hover:bg-gray-100',
                              isSelected &&
                                'border-primary border-1 bg-gray-100',
                            ],
                      )}
                    >
                      <div className="flex flex-col gap-2">
                        <p className="font-medium text-md">{option.name}</p>
                        {isUnavailable && (
                          <p className="text-xs text-red-500">
                            {!option.hasStock && 'Out of stock'}
                            {option.hasStock &&
                              'Incompatible with the following options:'}
                            {option.hasStock && (
                              <strong>
                                {' '}
                                {option.incompatibleWithMe
                                  .map((o) => o.name)
                                  .join(', ')}
                              </strong>
                            )}
                          </p>
                        )}
                      </div>
                    </Label>
                  </div>
                );
              })}
            </RadioGroup>
          </div>
        ))}
      </div>
    </div>
  );
}
