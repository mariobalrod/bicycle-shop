/* eslint-disable @typescript-eslint/no-misused-promises */
'use client';

import {
  type ProductProperty,
  type ProductPropertyOption,
} from '@prisma/client';
import { Loader2, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/app/components/AlertDialog';
import { Button } from '@/app/components/Button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/app/components/Dialog';
import { Input } from '@/app/components/form/Input';
import { Label } from '@/app/components/form/Label';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/form/Select';
import { Switch } from '@/app/components/form/Switch';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/app/components/Tooltip';
import { apiClient } from '@/server/trpc';

interface ProductPropertiesProps {
  productId: string;
}

export function ProductProperties({ productId }: ProductPropertiesProps) {
  const [newPropertyName, setNewPropertyName] = useState('');
  const [newOptionName, setNewOptionName] = useState('');
  const [selectedProperty, setSelectedProperty] =
    useState<ProductProperty | null>(null);
  const [isCreatingProperty, setIsCreatingProperty] = useState(false);
  const [isAddingOption, setIsAddingOption] = useState(false);
  const [
    selectedOptionForIncompatibility,
    setSelectedOptionForIncompatibility,
  ] = useState<ProductPropertyOption | null>(null);
  const [selectedIncompatibleOption, setSelectedIncompatibleOption] = useState<
    string | null
  >(null);
  const [isDeletingProperty, setIsDeletingProperty] = useState(false);
  const [isDeletingOption, setIsDeletingOption] = useState(false);
  const [isDeletingIncompatibility, setIsDeletingIncompatibility] =
    useState(false);
  const [isUpdatingStock, setIsUpdatingStock] = useState(false);

  const {
    data: properties = [],
    isLoading: isLoadingProperties,
    refetch: refetchProperties,
  } = apiClient.productCustomization.getProductProperties.useQuery({
    productId,
  });

  const createProperty =
    apiClient.productCustomization.createPropertyWithOptions.useMutation({
      onSuccess: () => {
        toast.success('Property created successfully');
        setNewPropertyName('');
        setNewOptionName('');
        setIsCreatingProperty(false);
        void refetchProperties();
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });

  const addOption =
    apiClient.productCustomization.addPropertyOption.useMutation({
      onSuccess: () => {
        toast.success('Option added successfully');
        setNewOptionName('');
        setIsAddingOption(false);
        void refetchProperties();
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });

  const createIncompatibility =
    apiClient.productCustomization.createOptionIncompatibility.useMutation({
      onSuccess: () => {
        toast.success('Incompatibility set successfully');
        setSelectedOptionForIncompatibility(null);
        setSelectedIncompatibleOption(null);
        void refetchProperties();
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });

  const removeIncompatibility =
    apiClient.productCustomization.removeOptionIncompatibility.useMutation({
      onSuccess: () => {
        toast.success('Incompatibility removed successfully');
        void refetchProperties();
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });

  const deleteProperty =
    apiClient.productCustomization.deleteProperty.useMutation({
      onSuccess: () => {
        toast.success('Property deleted successfully');
        setIsDeletingProperty(false);
        void refetchProperties();
      },
      onError: (error) => {
        toast.error(error.message);
        setIsDeletingProperty(false);
      },
    });

  const deleteOption = apiClient.productCustomization.deleteOption.useMutation({
    onSuccess: () => {
      toast.success('Option deleted successfully');
      setIsDeletingOption(false);
      void refetchProperties();
    },
    onError: (error) => {
      toast.error(error.message);
      setIsDeletingOption(false);
    },
  });

  const updateOptionStock =
    apiClient.productCustomization.updateOptionStock.useMutation({
      onSuccess: () => {
        toast.success('Stock status updated successfully');
        void refetchProperties();
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });

  const handleCreateProperty = async () => {
    if (!newPropertyName || !newOptionName) return;
    setIsCreatingProperty(true);
    await createProperty.mutateAsync({
      productId,
      name: newPropertyName,
      options: [newOptionName],
    });
  };

  const handleAddOption = async () => {
    if (!selectedProperty || !newOptionName) return;
    setIsAddingOption(true);
    await addOption.mutateAsync({
      propertyId: selectedProperty.id,
      name: newOptionName,
    });
  };

  const handleCreateIncompatibility = async () => {
    if (!selectedOptionForIncompatibility || !selectedIncompatibleOption)
      return;

    await createIncompatibility.mutateAsync({
      optionId1: selectedOptionForIncompatibility.id,
      optionId2: selectedIncompatibleOption,
    });
  };

  const handleDeleteProperty = async (propertyId: string) => {
    setIsDeletingProperty(true);
    await deleteProperty.mutateAsync({
      propertyId,
    });
  };

  const handleDeleteOption = async (optionId: string) => {
    setIsDeletingOption(true);
    await deleteOption.mutateAsync({
      optionId,
    });
  };

  const handleRemoveIncompatibility = async (
    optionId1: string,
    optionId2: string,
  ) => {
    setIsDeletingIncompatibility(true);
    try {
      await removeIncompatibility.mutateAsync({
        optionId1,
        optionId2,
      });
    } finally {
      setIsDeletingIncompatibility(false);
    }
  };

  const handleUpdateStock = async (optionId: string, hasStock: boolean) => {
    setIsUpdatingStock(true);
    try {
      await updateOptionStock.mutateAsync({
        optionId,
        hasStock,
      });
    } finally {
      setIsUpdatingStock(false);
    }
  };

  // Get all options from other properties for incompatibility selection
  const getOtherOptions = (currentOption: ProductPropertyOption) => {
    return properties
      .flatMap((prop) => prop.options)
      .filter((opt) => opt.id !== currentOption.id);
  };

  // Add this helper function
  const formatIncompatibilities = (
    incompatibilities: ProductPropertyOption[],
  ) => {
    const visibleIncompatibilities = incompatibilities.slice(0, 6);
    const remainingCount = Math.max(0, incompatibilities.length - 6);
    const remainingIncompatibilities = incompatibilities.slice(2);

    return {
      visibleIncompatibilities,
      remainingCount,
      remainingIncompatibilities,
    };
  };

  if (isLoadingProperties) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-base font-semibold leading-7 text-gray-900">
          Product Properties
        </h2>
        <p className="mt-1 text-sm leading-6 text-gray-600">
          Configure the properties and options for this product. Properties can
          have multiple options, and you can set incompatibilities between
          options from different properties.
        </p>
      </div>

      {/* Create new property */}
      <div className="rounded-lg border border-gray-200 p-4 sm:p-6">
        <h4 className="text-sm font-medium text-gray-700 mb-4">
          Add New Property
        </h4>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Label htmlFor="propertyName">Property Name</Label>
            <Input
              id="propertyName"
              value={newPropertyName}
              onChange={(e) => setNewPropertyName(e.target.value)}
              placeholder="e.g., Frame Size"
              disabled={isCreatingProperty}
              className="mt-1"
            />
          </div>
          <div className="flex-1">
            <Label htmlFor="optionName">Initial Option</Label>
            <Input
              id="optionName"
              value={newOptionName}
              onChange={(e) => setNewOptionName(e.target.value)}
              placeholder="e.g., Small"
              disabled={isCreatingProperty}
              className="mt-1"
            />
          </div>
          <div className="flex sm:items-end mt-4 sm:mt-0">
            <Button
              onClick={handleCreateProperty}
              disabled={
                !newPropertyName || !newOptionName || isCreatingProperty
              }
              className="w-full sm:w-auto"
            >
              {isCreatingProperty ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                'Add Property'
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* List of properties */}
      <div className="space-y-6">
        {properties.map((property) => (
          <div
            key={property.id}
            className="rounded-lg border border-gray-200 p-4 sm:p-6"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 mb-4">
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-semibold text-gray-700">
                  {property.name}
                </h4>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                      disabled={isDeletingProperty}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Property</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete the property &ldquo;
                        {property.name}&rdquo;? This action cannot be undone and
                        will also delete all its options and incompatibilities.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
                        onClick={() => handleDeleteProperty(property.id)}
                      >
                        {isDeletingProperty ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Deleting...
                          </>
                        ) : (
                          'Delete Property'
                        )}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
              <Button
                variant="secondary"
                onClick={() => setSelectedProperty(property)}
                disabled={isAddingOption}
                className="w-full sm:w-auto"
              >
                Add Option
              </Button>
            </div>

            {selectedProperty?.id === property.id && (
              <div className="flex flex-col sm:flex-row gap-4 mb-4">
                <div className="flex-1">
                  <Label htmlFor={`optionName-${property.id}`}>
                    Option Name
                  </Label>
                  <Input
                    id={`optionName-${property.id}`}
                    value={newOptionName}
                    onChange={(e) => setNewOptionName(e.target.value)}
                    placeholder="e.g., Medium"
                    disabled={isAddingOption}
                    className="mt-1"
                  />
                </div>
                <div className="flex sm:items-end">
                  <Button
                    onClick={handleAddOption}
                    disabled={!newOptionName || isAddingOption}
                    className="w-full sm:w-auto"
                  >
                    {isAddingOption ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Adding...
                      </>
                    ) : (
                      'Add'
                    )}
                  </Button>
                </div>
              </div>
            )}

            <div className="space-y-2">
              {property.options.map((option) => (
                <div
                  key={option.id}
                  className="flex flex-col justify-between gap-2 p-2 rounded-md bg-gray-50"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-sm font-medium ${!option.hasStock ? 'text-gray-400' : ''}`}
                      >
                        {option.name}
                      </span>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                            disabled={isDeletingOption}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Option</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete the option &ldquo;
                              {option.name}&rdquo;? This action cannot be undone
                              and will remove all its incompatibilities.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
                              onClick={() => handleDeleteOption(option.id)}
                            >
                              {isDeletingOption ? (
                                <>
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  Deleting...
                                </>
                              ) : (
                                'Delete Option'
                              )}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                    <div className="flex items-center gap-2">
                      <Label
                        htmlFor={`stock-${option.id}`}
                        className="text-sm text-gray-500"
                      >
                        In Stock
                      </Label>
                      <Switch
                        id={`stock-${option.id}`}
                        checked={option.hasStock}
                        onCheckedChange={(checked) =>
                          handleUpdateStock(option.id, checked)
                        }
                        disabled={isUpdatingStock}
                      />
                    </div>
                  </div>
                  <div className="flex flex-col items-start gap-2 sm:gap-4">
                    {option.incompatibleWith.length > 0 && (
                      <div className="flex flex-col gap-1 sm:gap-2 w-full sm:w-auto">
                        <span className="text-xs text-gray-500 whitespace-nowrap">
                          Incompatible with:
                        </span>
                        <div className="flex flex-wrap gap-1 flex-1">
                          {formatIncompatibilities(
                            option.incompatibleWith,
                          ).visibleIncompatibilities.map((opt) => (
                            <AlertDialog key={opt.id}>
                              <AlertDialogTrigger asChild>
                                <div className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 rounded-full cursor-pointer hover:bg-red-200 transition-colors">
                                  <span className="text-xs whitespace-nowrap">
                                    {opt.name}
                                  </span>
                                  <span className="ml-1 text-xs hover:text-red-900">
                                    ×
                                  </span>
                                </div>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    Remove Incompatibility
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to remove the
                                    incompatibility between &ldquo;{option.name}
                                    &rdquo; and &ldquo;{opt.name}&rdquo;?
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel
                                    disabled={isDeletingIncompatibility}
                                  >
                                    Cancel
                                  </AlertDialogCancel>
                                  <AlertDialogAction
                                    className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
                                    onClick={() =>
                                      handleRemoveIncompatibility(
                                        option.id,
                                        opt.id,
                                      )
                                    }
                                    disabled={isDeletingIncompatibility}
                                  >
                                    {isDeletingIncompatibility ? (
                                      <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Removing...
                                      </>
                                    ) : (
                                      'Remove Incompatibility'
                                    )}
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          ))}
                          {formatIncompatibilities(option.incompatibleWith)
                            .remainingCount > 0 && (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <span className="inline-flex px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full cursor-help hover:bg-gray-200 transition-colors whitespace-nowrap">
                                    +
                                    {
                                      formatIncompatibilities(
                                        option.incompatibleWith,
                                      ).remainingCount
                                    }
                                  </span>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p className="text-sm font-medium mb-1">
                                    Other incompatibilities:
                                  </p>
                                  <div className="space-y-1">
                                    {formatIncompatibilities(
                                      option.incompatibleWith,
                                    ).remainingIncompatibilities.map((opt) => (
                                      <div key={opt.id} className="text-sm">
                                        • {opt.name}
                                      </div>
                                    ))}
                                  </div>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )}
                        </div>
                      </div>
                    )}
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() =>
                        setSelectedOptionForIncompatibility(option)
                      }
                      className="w-full sm:w-auto whitespace-nowrap"
                    >
                      Set Incompatibility
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Incompatibility Modal */}
      <Dialog
        open={selectedOptionForIncompatibility !== null}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedOptionForIncompatibility(null);
            setSelectedIncompatibleOption(null);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Set Incompatibility for {selectedOptionForIncompatibility?.name}
            </DialogTitle>
            <DialogDescription>
              Select an option that is incompatible with this one. Users
              won&apos;t be able to select these options together.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <Label>Select Incompatible Option</Label>
            <Select
              value={selectedIncompatibleOption ?? ''}
              onValueChange={setSelectedIncompatibleOption}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {selectedOptionForIncompatibility &&
                    getOtherOptions(selectedOptionForIncompatibility).map(
                      (option) => (
                        <SelectItem key={option.id} value={option.id}>
                          {option.name}
                        </SelectItem>
                      ),
                    )}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button
              variant="secondary"
              onClick={() => {
                setSelectedOptionForIncompatibility(null);
                setSelectedIncompatibleOption(null);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateIncompatibility}
              disabled={!selectedIncompatibleOption}
            >
              Set Incompatibility
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
