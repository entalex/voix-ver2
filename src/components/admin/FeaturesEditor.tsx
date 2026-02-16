import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Upload, Loader2 } from "lucide-react";
import {
  useProductFeatures,
  useUpsertFeature,
  useDeleteFeature,
  useUploadFeatureImage,
  type ProductFeature,
} from "@/hooks/useProductFeatures";

const FeaturesEditor = () => {
  const { data: features = [], isLoading } = useProductFeatures();
  const upsert = useUpsertFeature();
  const remove = useDeleteFeature();
  const uploadImage = useUploadFeatureImage();
  const { toast } = useToast();

  const [drafts, setDrafts] = useState<Record<string, Partial<ProductFeature>>>({});
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const fileRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const getDraft = (f: ProductFeature) => ({
    title: drafts[f.id]?.title ?? f.title,
    description: drafts[f.id]?.description ?? f.description,
  });

  const updateDraft = (id: string, field: string, value: string) => {
    setDrafts((prev) => ({
      ...prev,
      [id]: { ...prev[id], [field]: value },
    }));
  };

  const saveFeature = async (f: ProductFeature) => {
    const d = drafts[f.id];
    if (!d) return;
    await upsert.mutateAsync({ id: f.id, ...d, order_index: f.order_index });
    setDrafts((prev) => {
      const next = { ...prev };
      delete next[f.id];
      return next;
    });
    toast({ title: "Feature saved!" });
  };

  const addFeature = async () => {
    await upsert.mutateAsync({
      title: "New Feature",
      description: "Describe this feature...",
      order_index: features.length,
    });
    toast({ title: "Feature added!" });
  };

  const deleteFeature = async (id: string) => {
    await remove.mutateAsync(id);
    toast({ title: "Feature removed." });
  };

  const handleImageUpload = async (featureId: string, file: File) => {
    setUploadingId(featureId);
    try {
      const publicUrl = await uploadImage.mutateAsync({ file, featureId });
      // Add cache-busting param
      const urlWithCacheBust = `${publicUrl}?t=${Date.now()}`;
      await upsert.mutateAsync({ id: featureId, image_url: urlWithCacheBust });
      toast({ title: "Image uploaded!" });
    } finally {
      setUploadingId(null);
    }
  };

  if (isLoading) return <p className="text-muted-foreground p-4">Loading features...</p>;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Product Features</CardTitle>
        <Button variant="outline" size="sm" onClick={addFeature} disabled={upsert.isPending}>
          <Plus className="h-4 w-4 mr-1" /> Add
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        {features.map((feature) => {
          const d = getDraft(feature);
          const hasChanges = !!drafts[feature.id];
          const isUploading = uploadingId === feature.id;

          return (
            <div key={feature.id} className="p-4 border rounded-lg space-y-3 relative">
              <button
                type="button"
                onClick={() => deleteFeature(feature.id)}
                className="absolute top-3 right-3 text-destructive hover:text-destructive/80"
                disabled={remove.isPending}
              >
                <Trash2 className="h-4 w-4" />
              </button>

              <span className="text-xs font-medium text-muted-foreground">
                #{feature.order_index + 1}
              </span>

              <div>
                <Label>Title</Label>
                <Input
                  value={d.title}
                  onChange={(e) => updateDraft(feature.id, "title", e.target.value)}
                  maxLength={80}
                  className="mt-1"
                />
              </div>

              <div>
                <Label>Description</Label>
                <Textarea
                  value={d.description}
                  onChange={(e) => updateDraft(feature.id, "description", e.target.value)}
                  maxLength={500}
                  rows={3}
                  className="mt-1"
                />
              </div>

              {/* Image upload */}
              <div>
                <Label>Image</Label>
                <div className="mt-1 flex items-center gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => fileRefs.current[feature.id]?.click()}
                    disabled={isUploading}
                  >
                    {isUploading ? (
                      <><Loader2 className="h-4 w-4 mr-1 animate-spin" /> Uploading...</>
                    ) : (
                      <><Upload className="h-4 w-4 mr-1" /> Upload Image</>
                    )}
                  </Button>
                  <input
                    ref={(el) => { fileRefs.current[feature.id] = el; }}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleImageUpload(feature.id, file);
                    }}
                  />
                  {feature.image_url && (
                    <img
                      src={feature.image_url}
                      alt="Preview"
                      className="h-12 w-12 rounded object-cover border"
                    />
                  )}
                </div>
              </div>

              {hasChanges && (
                <Button
                  onClick={() => saveFeature(feature)}
                  disabled={upsert.isPending}
                  className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
                >
                  Save Changes
                </Button>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default FeaturesEditor;
