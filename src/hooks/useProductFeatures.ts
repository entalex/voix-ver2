import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface ProductFeature {
  id: string;
  title: string;
  description: string;
  image_url: string | null;
  order_index: number;
}

const QUERY_KEY = ["product_features"];

export function useProductFeatures() {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: async (): Promise<ProductFeature[]> => {
      const { data, error } = await supabase
        .from("product_features")
        .select("id, title, description, image_url, order_index")
        .order("order_index");
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useUpsertFeature() {
  const qc = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (feature: Partial<ProductFeature> & { id?: string }) => {
      const { data, error } = feature.id
        ? await supabase
            .from("product_features")
            .update({
              title: feature.title,
              description: feature.description,
              image_url: feature.image_url,
              order_index: feature.order_index,
            })
            .eq("id", feature.id)
            .select()
            .maybeSingle()
        : await supabase
            .from("product_features")
            .insert({
              title: feature.title ?? "",
              description: feature.description ?? "",
              image_url: feature.image_url ?? null,
              order_index: feature.order_index ?? 0,
            })
            .select()
            .maybeSingle();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEY }),
    onError: (err: Error) => { console.error(err); toast({ title: "Error saving feature", description: "An error occurred. Please try again.", variant: "destructive" }); },
  });
}

export function useDeleteFeature() {
  const qc = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("product_features").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEY }),
    onError: (err: Error) => toast({ title: "Error deleting feature", description: err.message, variant: "destructive" }),
  });
}

export function useUploadFeatureImage() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ file, featureId }: { file: File; featureId: string }) => {
      const ext = file.name.split(".").pop();
      const path = `features/${featureId}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("voix-images")
        .upload(path, file, { upsert: true });
      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("voix-images")
        .getPublicUrl(path);

      return urlData.publicUrl;
    },
    onError: (err: Error) => toast({ title: "Upload failed", description: err.message, variant: "destructive" }),
  });
}
