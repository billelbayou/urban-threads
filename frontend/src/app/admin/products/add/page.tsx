"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import CardContent from "@/components/ui/CardContent";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import { useRouter } from "next/navigation";

// Zod schema
const productSchema = z.object({
  name: z.string().min(3),
  description: z.string().min(10),
  price: z.number().positive(),
  stock: z.number().int().nonnegative(),
  categoryId: z.string().min(1),
  images: z.array(z.string().url()).min(1),
});

export default function AddProductPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<any[]>([]);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: {
      images: [""],
    },
  });

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      const res = await axios.get("http://localhost:8080/api/category", {
        withCredentials: true,
      });
      setCategories(res.data);
    };

    fetchCategories();
  }, []);

  const images = watch("images");

  const addImageField = () => {
    setValue("images", [...images, ""]);
  };

  const updateImage = (index: number, value: string) => {
    const updated = [...images];
    updated[index] = value;
    setValue("images", updated);
  };

  const onSubmit = async (data: any) => {
    try {
      await axios.post("http://localhost:8080/api/products", data, {
        withCredentials: true,
      });

      router.push("/admin/products");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Add Product</h1>

      <Card className="shadow-lg rounded-2xl">
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8">
            
            {/* NAME */}
            <div>
              <label className="font-medium">Name</label>
              <Input {...register("name")} />
              {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
            </div>

            {/* DESCRIPTION */}
            <div>
              <label className="font-medium">Description</label>
              <Textarea {...register("description")} rows={4} />
              {errors.description && (
                <p className="text-red-500 text-sm">{errors.description.message}</p>
              )}
            </div>

            {/* PRICE */}
            <div>
              <label className="font-medium">Price</label>
              <Input
                type="number"
                step="0.01"
                {...register("price", { valueAsNumber: true })}
              />
              {errors.price && <p className="text-red-500 text-sm">{errors.price.message}</p>}
            </div>

            {/* STOCK */}
            <div>
              <label className="font-medium">Stock</label>
              <Input type="number" {...register("stock", { valueAsNumber: true })} />
              {errors.stock && <p className="text-red-500 text-sm">{errors.stock.message}</p>}
            </div>

            {/* CATEGORY DROPDOWN */}
            <div>
              <label className="font-medium">Category</label>
              <select
                {...register("categoryId")}
                className="w-full p-2 border rounded-lg mt-1"
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>

              {errors.categoryId && (
                <p className="text-red-500 text-sm">{errors.categoryId.message}</p>
              )}
            </div>

            {/* IMAGE URL INPUTS + LIVE PREVIEW */}
            <div className="space-y-4">
              <label className="font-medium">Image URLs</label>

              {images.map((img: string, idx: number) => (
                <div key={idx} className="flex flex-col gap-2 border p-3 rounded-xl">
                  <Input
                    value={img}
                    placeholder="https://example.com/image.jpg"
                    onChange={(e) => updateImage(idx, e.target.value)}
                  />

                  {/* PREVIEW */}
                  {img && (
                    <div className="flex justify-center">
                      <img
                        src={img}
                        alt={`preview-${idx}`}
                        className="h-40 w-40 object-cover rounded-xl border"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "https://via.placeholder.com/150?text=Invalid+URL";
                        }}
                      />
                    </div>
                  )}
                </div>
              ))}

              <button
                type="button"
                onClick={addImageField}
                className="text-blue-600 underline"
              >
                + Add another image
              </button>

              {errors.images && (
                <p className="text-red-500 text-sm">{errors.images.message as string}</p>
              )}
            </div>

            <Button type="submit" className="w-full py-3 text-lg rounded-2xl">
              Add Product
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
