"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { WooProduct } from '@/types/woo'
import React, { useState } from 'react'
import Reviews from './Reviews'

const ProductDescription = ({ product }: { product: WooProduct }) => {
    const [reviews, setReviews] = useState<any[]>([]);
    const [reviewsLoaded, setReviewsLoaded] = useState(false);

    const loadReviews = async () => {
        if (reviewsLoaded) return; // prevent re-fetch
        const res = await fetch(`/api/products/reviews/${product.id}`);
        const data = await res.json();
        setReviews(data);
        setReviewsLoaded(true);
    };
    loadReviews();


    return (
        <Tabs defaultValue="description" className="w-full min-h-[400px] pb-18">
            <TabsList className='text-sm md:text-xl px-5 py-2 shadow-none bg-white w-full rounded-bottom'>
                <TabsTrigger value="description" className=''>Description</TabsTrigger>
                <TabsTrigger value="additional">Additional Information</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>
            <TabsContent value="description">{
                product.description && (
                    <div className="mt-12 px-4">
                        <div
                            className="prose prose-sm text-gray-700"
                            dangerouslySetInnerHTML={{ __html: product.description }}
                        />
                    </div>
                )
            }</TabsContent>
            <TabsContent value="additional" className='mt-12'>

                <div className='bg-white  shadow-sm  rounded-lg p-4 py-12 px-36'>
                    {product.brands.length > 0 &&
                        <div className='flex items-center p-4 border-b border-gray-200'>
                            <p className='w-1/2'>Brand</p>
                            <p className='w-1/2'>{product.brands.map(cat => cat.name).join(", ")}</p>
                        </div>
                    }
                    {product.tags.length > 0 &&
                        <div className='flex items-center p-4 border-b border-gray-200'>
                            <p className='w-1/2'>Tags</p>
                            <p className='w-1/2'>{product.brands.map(cat => cat.name).join(", ")}</p>
                        </div>
                    }
                    {
                        product.weight != "" &&
                        <div className='flex items-center p-4 border-b border-gray-200'>
                            <p className='w-1/2'>Weight (kg)</p>
                            <p className='w-1/2'>
                                <span>{product.weight}</span></p>
                        </div>
                    }
                    {
                        product.dimensions.width != "" &&
                        <div className='flex items-center p-4 border-b border-gray-200'>
                            <p className='w-1/2'>Dimension (width x height x length)</p>
                            <p className='w-1/2'>
                                <span>{product.dimensions.width}cm x {product.dimensions.height}cm x {product.dimensions.length}cm</span></p>
                        </div>
                    }
                </div>


            </TabsContent>
            <TabsContent value="reviews">
                <Reviews
                    id={product.id}
                    reviews={reviews}
                    setReviews={setReviews}
                    reviewsLoaded={reviewsLoaded}
                />
            </TabsContent>
        </Tabs>
    )
}

export default ProductDescription


