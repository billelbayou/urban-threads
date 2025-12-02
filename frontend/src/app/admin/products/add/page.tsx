"use client";

import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import api from "@/lib/axios";
import { Category } from "@/lib/types";
import { useRouter } from "next/navigation";
import Card from "@/components/ui/Card";
import CardContent from "@/components/ui/CardContent";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Button from "@/components/ui/Button";

// -------------------
// ZOD SCHEMA
// -------------------
const infoSectionSchema = z.object({
  title: z.string().min(3),
  content: z.string().min(10),
});

const productSchema = z.object({
  name: z.string().min(3),
  description: z.string().min(10),
  price: z.number().positive(),
  stock: z.number().int().nonnegative(),
  categoryId: z.string().min(1),
  gender: z.enum(["MEN", "WOMEN", "UNISEX"]),
  images: z.array(z.string().url()).min(1),
  infoSections: z.array(infoSectionSchema).min(1),
});

type ProductForm = z.infer<typeof productSchema>;

export default function AddProductPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProductForm>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      images: [""],
      infoSections: [
        { title: "Details & Care", content: "" },
        { title: "Size & Fit", content: "" },
        { title: "Sustainability", content: "" },
      ],
    },
  });

  // Field Arrays
  const { fields: imageFields, append: appendImage } = useFieldArray({
    control,
    name: "images",
  });

  const {
    fields: infoSectionFields,
    append: appendInfoSection,
    remove: removeInfoSection,
  } = useFieldArray({
    control,
    name: "infoSections",
  });

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      const res = await api.get("/api/category", { withCredentials: true });
      setCategories(res.data);
    };
    fetchCategories();
  }, []);

  const images = watch("images");

  // Submit product
  const onSubmit = async (data: ProductForm) => {
    try {
      await api.post("/api/products", data, {
        withCredentials: true,
      });

      router.push("/admin/products");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Add Product</h1>

      <Card className="shadow-lg rounded-2xl">
        <CardContent>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-8"
          >
            {/* NAME */}
            <div>
              <label className="font-medium">Name</label>
              <Input {...register("name")} />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name.message}</p>
              )}
            </div>

            {/* DESCRIPTION */}
            <div>
              <label className="font-medium">Description</label>
              <Textarea {...register("description")} rows={4} />
              {errors.description && (
                <p className="text-red-500 text-sm">
                  {errors.description.message}
                </p>
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
              {errors.price && (
                <p className="text-red-500 text-sm">{errors.price.message}</p>
              )}
            </div>

            {/* STOCK */}
            <div>
              <label className="font-medium">Stock</label>
              <Input
                type="number"
                {...register("stock", { valueAsNumber: true })}
              />
              {errors.stock && (
                <p className="text-red-500 text-sm">{errors.stock.message}</p>
              )}
            </div>

            {/* CATEGORY */}
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
                <p className="text-red-500 text-sm">
                  {errors.categoryId.message}
                </p>
              )}
            </div>

            {/* GENDER */}
            <div>
              <label className="font-medium">Gender</label>
              <select
                {...register("gender")}
                className="w-full p-2 border rounded-lg mt-1"
              >
                <option value="MEN">Men</option>
                <option value="WOMEN">Women</option>
                <option value="UNISEX">Unisex</option>
              </select>
              {errors.gender && (
                <p className="text-red-500 text-sm">{errors.gender?.message}</p>
              )}
            </div>

            {/* IMAGES */}
            <div className="space-y-4">
              <label className="font-medium">Images</label>

              {imageFields.map((field, idx) => (
                <div key={field.id} className="border p-3 rounded-xl space-y-2">
                  <Input
                    {...register(`images.${idx}` as const)}
                    placeholder="https://example.com/image.jpg"
                  />

                  {images[idx] && (
                    <div className="flex justify-center">
                      <img
                        src={images[idx]}
                        className="h-40 w-40 object-cover rounded-xl border"
                        alt="preview"
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
                onClick={() => appendImage({title: "", content: ""})}
                className="text-blue-600 underline"
              >
                + Add Image
              </button>

              {errors.images && (
                <p className="text-red-500 text-sm">
                  {errors.images.message as string}
                </p>
              )}
            </div>

            {/* INFO SECTIONS */}
            <div className="space-y-4">
              <label className="font-medium">
                Product Information Sections
              </label>

              {infoSectionFields.map((field, idx) => (
                <div
                  key={field.id}
                  className="border p-4 rounded-xl space-y-2 bg-gray-50"
                >
                  <Input
                    placeholder="Title"
                    {...register(`infoSections.${idx}.title` as const)}
                  />

                  <Textarea
                    placeholder="Content..."
                    rows={3}
                    {...register(`infoSections.${idx}.content` as const)}
                  />

                  <button
                    type="button"
                    onClick={() => removeInfoSection(idx)}
                    className="text-red-600 text-sm underline"
                  >
                    Remove Section
                  </button>

                  {errors.infoSections?.[idx] && (
                    <p className="text-red-500 text-sm">
                      {errors.infoSections[idx]?.title?.message ||
                        errors.infoSections[idx]?.content?.message}
                    </p>
                  )}
                </div>
              ))}

              <button
                type="button"
                onClick={() => appendInfoSection({ title: "", content: "" })}
                className="text-blue-600 underline"
              >
                + Add Section
              </button>
            </div>

            <Button className="w-full py-3 text-lg rounded-2xl" type="submit">
              Add Product
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
