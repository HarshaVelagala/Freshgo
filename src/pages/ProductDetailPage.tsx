import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Star,
  Plus,
  Minus,
  Heart,
  Truck,
  ShieldCheck,
  Sparkles,
  ChevronLeft,
  Share2,
  MapPin,
  Flame,
  CheckCircle2,
} from 'lucide-react';
import { Product } from '../types/grocery';
import { MockApiService } from '../services/mockApi';
import { ProductDetailSkeleton } from '../components/common/SkeletonLoader';
import { ProductCard } from '../components/product/ProductCard';
import { useCartStore } from '../stores/cartStore';
import { useFavoritesStore } from '../stores/favoritesStore';
import { useToast } from '../components/common/Toast';

export const ProductDetailPage: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const addItem = useCartStore((state) => state.addItem);
  const cartItems = useCartStore((state) => state.items);
  const isFavorite = useFavoritesStore((state) => (product ? state.isFavorite(product.id) : false));
  const toggleFavorite = useFavoritesStore((state) => state.toggleFavorite);

  useEffect(() => {
    const loadProduct = async () => {
      if (!productId) return;
      setIsLoading(true);
      try {
        const prod = await MockApiService.fetchProductById(productId);
        if (prod) {
          setProduct(prod);
          setSelectedImage(prod.image);
          // Load related products from same category
          const allProds = await MockApiService.fetchProducts({ category: prod.categoryId });
          setRelatedProducts(allProds.filter((p) => p.id !== prod.id).slice(0, 4));
        }
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };

    loadProduct();
    setQuantity(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [productId]);

  if (isLoading) {
    return <ProductDetailSkeleton />;
  }

  if (!product) {
    return (
      <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/10 p-8 max-w-md mx-auto my-12 text-[#E0E0E0]">
        <h2 className="text-lg font-bold text-white font-serif mb-2">Product Not Found</h2>
        <p className="text-xs text-neutral-400 mb-6">
          This grocery item may have been moved or removed from our fresh catalog.
        </p>
        <Link
          to="/categories"
          className="px-5 py-2.5 bg-[#A7C957] hover:bg-[#B7D968] text-[#0A0A0A] text-xs font-bold rounded-xl transition-colors cursor-pointer"
        >
          Return to Catalog
        </Link>
      </div>
    );
  }

  const isOutOfStock = product.stock <= 0;
  const inCartItem = cartItems.find((i) => i.product.id === product.id);

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addItem(product, quantity);
    addToast({
      type: 'success',
      title: 'Added to Basket',
      message: `${quantity}x ${product.name} added.`,
    });
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      addToast({
        type: 'info',
        title: 'Link Copied',
        message: 'Product link copied to clipboard.',
      });
    }
  };

  return (
    <div className="space-y-10 pb-16 text-[#E0E0E0]">
      {/* Breadcrumb & Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-xs font-semibold text-neutral-300 hover:text-white bg-white/5 px-3 py-1.5 rounded-xl border border-white/10 shadow-xs transition-colors cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="p-2 bg-white/5 text-neutral-300 hover:text-white rounded-xl border border-white/10 shadow-xs transition-colors cursor-pointer"
            aria-label="Share product"
          >
            <Share2 className="w-4 h-4" />
          </button>
          <button
            id="detail-fav-btn"
            onClick={() => {
              toggleFavorite(product.id);
              addToast({
                type: 'info',
                title: isFavorite ? 'Removed from favorites' : 'Saved to favorites',
                message: product.name,
              });
            }}
            className={`p-2 rounded-xl border shadow-xs transition-colors cursor-pointer ${
              isFavorite
                ? 'bg-rose-500/20 border-rose-500/30 text-rose-400'
                : 'bg-white/5 border-white/10 text-neutral-300 hover:text-rose-400'
            }`}
            aria-label="Toggle favorite"
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* Main Product Hero Box */}
      <div className="bg-white/5 rounded-3xl border border-white/10 p-6 sm:p-10 shadow-xl grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-start">
        {/* Left: Photos & Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-[#0A0A0A] border border-white/10">
            <img
              src={selectedImage}
              alt={product.name}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            {product.isDeal && product.discountPercent && (
              <span className="absolute top-3 left-3 bg-rose-500 text-white text-xs font-black px-2.5 py-1 rounded-lg shadow-xs">
                -{product.discountPercent}% OFF
              </span>
            )}
            {product.isOrganic && (
              <span className="absolute top-3 right-3 bg-[#A7C957] text-[#0A0A0A] text-xs font-bold px-2.5 py-1 rounded-lg shadow-xs flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Certified Organic</span>
              </span>
            )}
          </div>

          {/* Gallery Thumbnails */}
          {product.gallery && product.gallery.length > 0 && (
            <div className="flex gap-3 overflow-x-auto pb-1">
              <button
                onClick={() => setSelectedImage(product.image)}
                className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                  selectedImage === product.image ? 'border-[#A7C957] ring-2 ring-[#A7C957]/30' : 'border-white/10 bg-[#0A0A0A]'
                }`}
              >
                <img src={product.image} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </button>
              {product.gallery.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(img)}
                  className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                    selectedImage === img ? 'border-[#A7C957] ring-2 ring-[#A7C957]/30' : 'border-white/10 bg-[#0A0A0A]'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Info, Price, Actions */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-neutral-400 mb-1.5">
              <Link to={`/category/${product.categoryId}`} className="hover:text-[#A7C957] text-neutral-300">
                {product.category}
              </Link>
              {product.subcategory && (
                <>
                  <span>•</span>
                  <span>{product.subcategory}</span>
                </>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-white font-serif tracking-tight leading-snug">
              {product.name}
            </h1>

            {/* Rating & reviews */}
            <div className="flex items-center gap-3 mt-2 text-xs">
              <div className="flex items-center gap-1 font-bold text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{product.rating.toFixed(1)}</span>
              </div>
              <span className="text-neutral-400 font-medium">({product.reviewCount} customer reviews)</span>
              <span className="text-neutral-600">•</span>
              <span className="text-neutral-300 font-semibold">{product.unit}</span>
            </div>
          </div>

          {/* Pricing & Unit */}
          <div className="p-4 bg-white/5 rounded-2xl border border-white/10 flex items-baseline justify-between">
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-black text-white font-serif">
                  ${product.price.toFixed(2)}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-sm text-neutral-500 line-through">
                    ${product.originalPrice.toFixed(2)}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-neutral-400 mt-0.5">Price inclusive of all local taxes</p>
            </div>

            <div className="text-right">
              <span
                className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                  isOutOfStock
                    ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                    : product.stock <= 5
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    : 'bg-[#A7C957]/15 text-[#A7C957] border border-[#A7C957]/30'
                }`}
              >
                {isOutOfStock ? 'Sold Out' : `In Stock (${product.stock} available)`}
              </span>
            </div>
          </div>

          {/* Dietary Badges */}
          {product.dietary && product.dietary.length > 0 && (
            <div className="space-y-1.5">
              <h3 className="text-xs font-bold text-neutral-300 uppercase tracking-wider">Dietary Attributes</h3>
              <div className="flex flex-wrap gap-1.5">
                {product.dietary.map((d) => (
                  <span
                    key={d}
                    className="text-xs font-semibold bg-[#A7C957]/15 text-[#A7C957] border border-[#A7C957]/20 px-2.5 py-1 rounded-xl"
                  >
                    {d}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Description */}
          <div>
            <h3 className="text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1.5">Description</h3>
            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">{product.description}</p>
            {product.origin && (
              <p className="text-xs text-neutral-400 flex items-center gap-1 mt-2">
                <MapPin className="w-3.5 h-3.5 text-[#A7C957]" />
                <span>Origin: <strong className="text-white">{product.origin}</strong></span>
              </p>
            )}
          </div>

          {/* Quantity Stepper & Add Button */}
          <div className="pt-2 flex items-center gap-3">
            {!isOutOfStock && (
              <div className="flex items-center bg-white/5 rounded-2xl p-1 border border-white/10">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 shadow-xs flex items-center justify-center text-neutral-300 hover:text-white transition-colors cursor-pointer"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-10 text-center font-bold text-sm text-white">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  disabled={quantity >= product.stock}
                  className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 shadow-xs flex items-center justify-center text-neutral-300 hover:text-white disabled:opacity-30 transition-colors cursor-pointer"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            )}

            <button
              id="detail-add-cart-btn"
              disabled={isOutOfStock}
              onClick={handleAddToCart}
              className="flex-1 py-3.5 px-6 bg-[#A7C957] hover:bg-[#B7D968] disabled:bg-white/10 disabled:text-neutral-500 disabled:cursor-not-allowed text-[#0A0A0A] font-extrabold text-sm rounded-2xl shadow-lg shadow-[#A7C957]/10 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>
                {isOutOfStock
                  ? 'Currently Out of Stock'
                  : inCartItem
                  ? `Add More ($${(product.price * quantity).toFixed(2)})`
                  : `Add to Basket • $${(product.price * quantity).toFixed(2)}`}
              </span>
            </button>
          </div>

          {/* Delivery & freshness guarantees */}
          <div className="grid grid-cols-2 gap-3 pt-2 text-xs border-t border-white/10">
            <div className="flex items-center gap-2 text-neutral-300">
              <Truck className="w-4 h-4 text-[#A7C957]" />
              <span>Delivered in 15–25 mins</span>
            </div>
            <div className="flex items-center gap-2 text-neutral-300">
              <ShieldCheck className="w-4 h-4 text-[#A7C957]" />
              <span>100% Quality Guaranteed</span>
            </div>
          </div>
        </div>
      </div>

      {/* Nutritional Facts Table */}
      {product.nutrition && (
        <section className="bg-white/5 rounded-3xl border border-white/10 p-6 sm:p-8 shadow-xl">
          <h2 className="text-base font-bold text-white font-serif mb-4 flex items-center gap-2">
            <Flame className="w-4 h-4 text-amber-400" />
            <span>Nutritional Breakdown (Per Serving)</span>
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <div className="p-3 bg-white/5 rounded-2xl border border-white/10 text-center">
              <span className="text-[10px] uppercase font-bold text-neutral-400">Calories</span>
              <p className="text-lg font-black text-white mt-0.5">{product.nutrition.calories}</p>
            </div>
            <div className="p-3 bg-white/5 rounded-2xl border border-white/10 text-center">
              <span className="text-[10px] uppercase font-bold text-neutral-400">Protein</span>
              <p className="text-lg font-black text-[#A7C957] mt-0.5">{product.nutrition.protein}</p>
            </div>
            <div className="p-3 bg-white/5 rounded-2xl border border-white/10 text-center">
              <span className="text-[10px] uppercase font-bold text-neutral-400">Carbs</span>
              <p className="text-lg font-black text-white mt-0.5">{product.nutrition.carbs}</p>
            </div>
            <div className="p-3 bg-white/5 rounded-2xl border border-white/10 text-center">
              <span className="text-[10px] uppercase font-bold text-neutral-400">Total Fat</span>
              <p className="text-lg font-black text-white mt-0.5">{product.nutrition.fat}</p>
            </div>
            {product.nutrition.fiber && (
              <div className="p-3 bg-white/5 rounded-2xl border border-white/10 text-center">
                <span className="text-[10px] uppercase font-bold text-neutral-400">Dietary Fiber</span>
                <p className="text-lg font-black text-white mt-0.5">{product.nutrition.fiber}</p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Customer Reviews Section */}
      <section className="bg-white/5 rounded-3xl border border-white/10 p-6 sm:p-8 shadow-xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white font-serif">Verified Customer Reviews</h2>
            <p className="text-xs text-neutral-400">Based on {product.reviewCount} local Bay Area deliveries</p>
          </div>
          <div className="flex items-center gap-1.5 bg-[#A7C957]/15 text-[#A7C957] border border-[#A7C957]/20 px-3 py-1.5 rounded-xl text-xs font-bold">
            <CheckCircle2 className="w-4 h-4 text-[#A7C957]" />
            <span>98% Freshness Satisfaction</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-white/5 rounded-2xl border border-white/10 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-neutral-200">David M. • Verified Buyer</span>
              <div className="flex text-amber-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-3 h-3 fill-amber-400" />
                ))}
              </div>
            </div>
            <p className="text-xs text-neutral-300 leading-relaxed">
              "Arrived in under 20 minutes and perfectly ripe. The quality rivals the best farmers market stalls in Marin."
            </p>
          </div>

          <div className="p-4 bg-white/5 rounded-2xl border border-white/10 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-neutral-200">Elena R. • Prime Member</span>
              <div className="flex text-amber-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-3 h-3 fill-amber-400" />
                ))}
              </div>
            </div>
            <p className="text-xs text-neutral-300 leading-relaxed">
              "Super fresh, crisp texture, and zero bruising. Always part of my weekly grocery basket."
            </p>
          </div>
        </div>
      </section>

      {/* Related Products Carousel */}
      {relatedProducts.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base sm:text-xl font-bold text-white font-serif">
              Pairs Well With This <span className="text-[#A7C957] italic">Item</span>
            </h2>
            <Link
              to={`/category/${product.categoryId}`}
              className="text-xs font-bold text-[#A7C957] hover:text-[#B7D968]"
            >
              See more
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
