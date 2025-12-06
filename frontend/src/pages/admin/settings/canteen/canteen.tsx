import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  useCreateRecordsAmount,
  useFetchRecordsAmount,
  useUpdateRecordsAmount,
} from "@/services/api/settings/settings.queries";
import { useFetchClasses } from "@/services/api/classes/classes.queries";
import { useUpdateClassCanteenPrice } from "@/services/api/classes/classes.queries";

export default function Canteen() {
  const { mutate: createRecordsAmount, isLoading: creatingPriceLoader } =
    useCreateRecordsAmount();
  const { mutate: updateRecordsAmount, isLoading: updatingPriceLoader } =
    useUpdateRecordsAmount();
  const { data: amountSetting, isLoading, error } = useFetchRecordsAmount();
  const { data: classesData } = useFetchClasses();
  const { mutate: updateClassPrice, isLoading: updatingClassPrice } =
    useUpdateClassCanteenPrice();

  const [classPriceDrafts, setClassPriceDrafts] = useState<
    Record<number, string | number>
  >({});

  // State for edit mode and input value
  const [isEditing, setIsEditing] = useState(false);
  const [price, setPrice] = useState<string | number>("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (error) {
      console.error("Error fetching records amount:", error);
      toast.error("Failed to fetch records amount.");
    }
    if (amountSetting) {
      setPrice(amountSetting?.data?.value || ""); // Populate initial price
    }
  }, [error, amountSetting]);

  // Handle save/update
  const handleSave = () => {
    if (!price || Number(price) < 0) {
      toast.error("Price must be a valid positive number.");
      return;
    }

    updateRecordsAmount({ value: String(price) });
  };

  // Handle create if price doesn't exist
  const handleCreate = async () => {
    if (!price || Number(price) < 0) {
      toast.error("Price must be a valid positive number.");
      return;
    }

    await createRecordsAmount(
      { name: "amount", value: String(price) },
      {
        onSuccess: () => {
          setIsModalOpen(false);
        },
      }
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Canteen Settings</h1>
        <p className="text-muted-foreground">
          Manage your canteen preferences and notifications.
        </p>
      </div>
      <Separator />
      <Card>
        <CardHeader>
          <CardTitle>Canteen Notification Preferences</CardTitle>
          <CardDescription>
            Choose what notifications you want to receive.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between space-x-4">
            <div className="flex-1 space-y-1">
              <Label htmlFor="daily-menu">Daily Payments Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive notifications about the daily payments updates.
              </p>
            </div>
            <Switch id="daily-menu" />
          </div>
          <Separator />
          <div className="flex items-center justify-between space-x-4">
            <div className="flex-1 space-y-1">
              <Label htmlFor="canteen-price">Canteen Pricing</Label>
              <p className="text-sm text-muted-foreground">
                Change the pricing of the canteen items.
              </p>
            </div>
            {isLoading ? (
              <Skeleton className="h-8 w-56 bg-muted/50" />
            ) : (
              <div className="flex items-center w-56 text-right">
                {!isEditing ? (
                  <span className="text-lg font-medium text-primary">
                    {amountSetting?.data?.value
                      ? `GH₵${amountSetting.data.value}`
                      : "Not Set"}
                  </span>
                ) : (
                  <Input
                    id="canteen-price"
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full"
                    min="0"
                  />
                )}
              </div>
            )}
          </div>
          <div className="flex justify-end space-x-4">
            {!amountSetting?.data?.value ? (
              <Button
                onClick={() => setIsModalOpen(true)}
                disabled={creatingPriceLoader}
              >
                Create
              </Button>
            ) : !isEditing ? (
              <Button
                onClick={() => setIsEditing(true)}
                disabled={creatingPriceLoader || updatingPriceLoader}
              >
                Edit
              </Button>
            ) : (
              <>
                <Button
                  variant="outline"
                  onClick={() => setIsEditing(false)}
                  disabled={creatingPriceLoader || updatingPriceLoader}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={creatingPriceLoader || updatingPriceLoader}
                >
                  {updatingPriceLoader ? "Saving..." : "Save"}
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Per-Class Canteen Pricing</CardTitle>
          <CardDescription>
            View and adjust canteen price per class.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!classesData ? (
            <Skeleton className="h-32 w-full bg-muted/50" />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left border-b">
                    <th className="py-2 pr-4">Class</th>
                    <th className="py-2 pr-4">Current Price (GH₵)</th>
                    <th className="py-2 pr-4">New Price</th>
                    <th className="py-2 pr-4">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {classesData.map((cls: Class) => {
                    const draftValue =
                      classPriceDrafts[cls.id] ?? cls.canteenPrice ?? "";
                    return (
                      <tr key={cls.id} className="border-b last:border-0">
                        <td className="py-2 pr-4 font-medium">{cls.name}</td>
                        <td className="py-2 pr-4">{cls.canteenPrice ?? "—"}</td>
                        <td className="py-2 pr-4">
                          <Input
                            type="number"
                            min={0}
                            value={draftValue}
                            onChange={(e) =>
                              setClassPriceDrafts((prev) => ({
                                ...prev,
                                [cls.id]: e.target.value,
                              }))
                            }
                            className="w-28"
                          />
                        </td>
                        <td className="py-2 pr-4">
                          <Button
                            size="sm"
                            disabled={updatingClassPrice || updatingClassPrice}
                            onClick={() => {
                              const val = Number(draftValue);
                              if (isNaN(val) || val < 0) {
                                toast.error(
                                  "Enter a valid non-negative number"
                                );
                                return;
                              }
                              updateClassPrice({
                                id: cls.id,
                                canteenPrice: val,
                              });
                            }}
                          >
                            Save
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create Canteen Pricing</DialogTitle>
            <DialogDescription>
              Set the initial pricing for canteen items.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="modal-price" className="col-span-4">
                Price (GH₵)
              </Label>
              <Input
                id="modal-price"
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="col-span-4"
                min="0"
                placeholder="Enter price"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreate} disabled={creatingPriceLoader}>
              {creatingPriceLoader ? "Creating..." : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
