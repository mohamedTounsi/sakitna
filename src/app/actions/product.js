"use server";

import dbConnect from "@/lib/mongodb";
import Product from "@/lib/models/Product";
import { revalidatePath } from "next/cache";

export async function createProduct(data) {
  await dbConnect();

  const {
    title,
    description,
    frontImage,
    backImage,
    galleryImages,
    price1,
    price2,
    price3,
    originalPrice,
    isMostWanted,
  } = data;

  try {
    await Product.create({
      title,
      description,
      frontImage: frontImage || '',
      backImage: backImage || '',
      galleryImages: galleryImages || [],
      // Keep legacy image field pointing to frontImage for backwards compat
      image: frontImage || '',
      price1: parseFloat(price1),
      price2: parseFloat(price2),
      price3: parseFloat(price3) || 0,
      originalPrice: originalPrice ? parseFloat(originalPrice) : null,
      isMostWanted: isMostWanted === true || isMostWanted === 'on',
    });
    revalidatePath("/admin/products");
    revalidatePath("/shop");
    return { success: true };
  } catch (error) {
    console.error("Error creating product:", error);
    return { success: false, error: error.message };
  }
}

export async function updateProduct(id, data) {
  await dbConnect();

  const {
    title,
    description,
    frontImage,
    backImage,
    galleryImages,
    price1,
    price2,
    price3,
    originalPrice,
    isMostWanted,
  } = data;

  try {
    const updateData = {
      title,
      description,
      price1: parseFloat(price1),
      price2: parseFloat(price2),
      price3: parseFloat(price3) || 0,
      originalPrice: originalPrice ? parseFloat(originalPrice) : null,
      isMostWanted: isMostWanted === true || isMostWanted === 'on',
    };

    if (frontImage) {
      updateData.frontImage = frontImage;
      updateData.image = frontImage; // keep legacy field in sync
    }
    if (backImage) {
      updateData.backImage = backImage;
    }
    if (galleryImages && galleryImages.length > 0) {
      updateData.galleryImages = galleryImages;
    }

    await Product.findByIdAndUpdate(id, updateData, { new: true });
    revalidatePath("/admin/products");
    revalidatePath(`/admin/products/${id}/edit`);
    revalidatePath("/shop");
    revalidatePath(`/shop/${id}`);
    return { success: true };
  } catch (error) {
    console.error("Error updating product:", error);
    return { success: false, error: error.message };
  }
}

export async function getProducts() {
  await dbConnect();
  try {
    const products = await Product.find({}).sort({ createdAt: -1 }).lean();
    return JSON.parse(JSON.stringify(products));
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

export async function getProductById(id) {
  await dbConnect();
  try {
    const product = await Product.findById(id).lean();
    return JSON.parse(JSON.stringify(product));
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
}

export async function deleteProduct(id) {
  await dbConnect();
  try {
    await Product.findByIdAndDelete(id);
    revalidatePath("/admin/products");
    revalidatePath("/shop");
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
