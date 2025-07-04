"use client";

import type React from "react";
import { createNewPost } from "@/app/action";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Upload,
  X,
  MapPin,
  Mail,
  DollarSign,
  ArrowLeft,
  ImageIcon,
  Tag,
  FileText,
  Eye,
} from "lucide-react";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { ListingSchema, type ListingSchemaType } from "@/types/posts";
import { useRouter } from "next/navigation";

const categories = [
  "Electronics",
  "Vehicles",
  "Home & Garden",
  "Clothing & Accessories",
  "Sports & Recreation",
  "Books & Media",
  "Toys & Games",
  "Furniture",
];

export function ListingForm({
  data = {},
}: {
  data?: Partial<ListingSchemaType>;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const router = useRouter();

  const form = useForm<ListingSchemaType>({
    resolver: zodResolver(ListingSchema),
    defaultValues: {
      title: data.title ?? "",
      description: data.description ?? "",
      price: data.price ?? 0,
      category: data.category ?? "",
      location: data.location ?? "",
      seller_email: data.seller_email ?? "",
    },
  });

  const { isSubmitting } = form.formState;
  const watchedValues = form.watch();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setSelectedFile(file || null);

    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const removeImage = () => {
    setSelectedFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  async function onSubmit(data: ListingSchemaType) {
    try {
      const formData = new FormData();
      for (const [key, value] of Object.entries(data)) {
        formData.append(key, String(value));
      }

      if (selectedFile) {
        formData.append("file", selectedFile);
      }

      await createNewPost(formData);
      form.reset();
      setSelectedFile(null);
      setImagePreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      toast.success("Listing published successfully!");
      router.push("/");
    } catch (error) {
      toast.error("Failed to publish listing");
      console.error("Error creating post:", error);
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price || 0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100/50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            size="sm"
            className="mb-4 -ml-2 h-9 text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to listings
          </Button>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-slate-900">
              Create New Listing
            </h1>
            <p className="text-slate-600">
              Fill out the details below to create your marketplace listing
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
          {/* Form Section */}
          <div className="xl:col-span-3">
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-6">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <FileText className="h-5 w-5 text-blue-600" />
                  Listing Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-8">
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-8"
                  >
                    {/* Photo Upload Section */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <ImageIcon className="h-4 w-4 text-slate-600" />
                        <FormLabel className="text-base font-semibold text-slate-900">
                          Product Photo
                        </FormLabel>
                      </div>

                      {imagePreview ? (
                        <div className="relative group">
                          <div className="relative overflow-hidden rounded-xl border-2 border-slate-200">
                            <img
                              src={imagePreview || "/placeholder.svg"}
                              alt="Preview"
                              className="w-full h-48 object-cover"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                          </div>
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={removeImage}
                            className="absolute top-3 right-3 h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <div
                          onClick={() => fileInputRef.current?.click()}
                          className="w-full h-48 border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 hover:bg-blue-50/50 transition-all duration-200 group"
                        >
                          <div className="p-4 rounded-full bg-slate-100 group-hover:bg-blue-100 transition-colors">
                            <Upload className="h-8 w-8 text-slate-400 group-hover:text-blue-500" />
                          </div>
                          <div className="mt-4 text-center">
                            <p className="text-sm font-medium text-slate-700">
                              Click to upload photo
                            </p>
                            <p className="text-xs text-slate-500 mt-1">
                              PNG, JPG up to 10MB
                            </p>
                          </div>
                        </div>
                      )}
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileChange}
                      />
                    </div>

                    <Separator />

                    {/* Basic Information */}
                    <div className="space-y-6">
                      <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                        <Tag className="h-4 w-4 text-slate-600" />
                        Basic Information
                      </h3>

                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium text-slate-700">
                              Title *
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="What are you selling?"
                                className="h-11 border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="category"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium text-slate-700">
                                Category *
                              </FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger className="h-11 border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20">
                                    <SelectValue placeholder="Select category" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {categories.map((category) => (
                                    <SelectItem
                                      key={category}
                                      value={category.toLowerCase()}
                                    >
                                      {category}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="price"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium text-slate-700">
                                Price *
                              </FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                                  <Input
                                    type="number"
                                    step="0.01"
                                    placeholder="0.00"
                                    className="h-11 pl-10 border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                                    {...field}
                                    onChange={(e) =>
                                      field.onChange(Number(e.target.value))
                                    }
                                  />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium text-slate-700">
                              Description
                            </FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Describe your item in detail..."
                                className="min-h-[120px] border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 resize-none"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <Separator />

                    {/* Contact Information */}
                    <div className="space-y-6">
                      <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                        <Mail className="h-4 w-4 text-slate-600" />
                        Contact Information
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="location"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium text-slate-700">
                                Location
                              </FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                                  <Input
                                    placeholder="City, State"
                                    className="h-11 pl-10 border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                                    {...field}
                                  />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="seller_email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium text-slate-700">
                                Email *
                              </FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                                  <Input
                                    type="email"
                                    placeholder="your@email.com"
                                    className="h-11 pl-10 border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                                    {...field}
                                  />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    <Separator />

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold text-base shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                          Creating Listing...
                        </>
                      ) : (
                        "Create Listing"
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>

          {/* Preview Section */}
          <div className="xl:col-span-2">
            <div className="sticky top-6">
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm overflow-hidden">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Eye className="h-4 w-4 text-green-600" />
                    Live Preview
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  {/* Preview Image */}
                  <div className="aspect-video bg-gradient-to-br from-slate-100 to-slate-200 relative">
                    {imagePreview ? (
                      <img
                        src={imagePreview || "/placeholder.svg"}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="text-center">
                          <ImageIcon className="h-12 w-12 text-slate-300 mx-auto mb-2" />
                          <p className="text-sm text-slate-400">
                            No image uploaded
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    {/* Title and Price */}
                    <div className="mb-4">
                      <h4 className="font-semibold text-slate-900 text-lg mb-2 line-clamp-2">
                        {watchedValues.title ||
                          "Your listing title will appear here"}
                      </h4>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-green-600">
                          {formatPrice(watchedValues.price)}
                        </span>
                        {watchedValues.category && (
                          <Badge
                            variant="secondary"
                            className="capitalize font-medium"
                          >
                            {watchedValues.category}
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Description */}
                    {watchedValues.description && (
                      <div className="mb-4">
                        <p className="text-sm text-slate-600 line-clamp-4 leading-relaxed">
                          {watchedValues.description}
                        </p>
                      </div>
                    )}

                    {/* Location */}
                    {watchedValues.location && (
                      <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
                        <MapPin className="h-4 w-4" />
                        <span>{watchedValues.location}</span>
                      </div>
                    )}

                    {/* Contact Button Preview */}
                    <Button className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium">
                      Contact Seller
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
