import { useMemo, useState } from "react";
import { Heart, MapPin, Plus, Check, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Reveal } from "@/components/reveal";
import { TRAVELER_POSTS, type TravelerPost } from "@/lib/posts-catalog";
import { PLACES, type Place } from "@/lib/places-catalog";
import { useTripBasket } from "@/lib/trip-basket";

const RING: Record<TravelerPost["accent"], string> = {
  sunset: "from-sunset to-mango",
  lagoon: "from-lagoon to-leaf",
  grape: "from-grape to-sunset",
  mango: "from-mango to-sunset",
  leaf: "from-leaf to-lagoon",
};

function findPlace(placeId?: string): Place | undefined {
  if (!placeId) return undefined;
  for (const list of Object.values(PLACES)) {
    const hit = list.find((p) => p.id === placeId);
    if (hit) return hit;
  }
  return undefined;
}

function PostCard({ post }: { post: TravelerPost }) {
  const { add, has } = useTripBasket();
  const place = useMemo(() => findPlace(post.placeId), [post.placeId]);
  const [liked, setLiked] = useState(false);
  const added = place ? has(place.id) : false;

  return (
    <article className="press shine group overflow-hidden rounded-3xl border bg-card shadow-sm transition duration-500 hover:-translate-y-1.5 hover:border-foreground/15 hover:shadow-2xl">
      <div className="flex items-center gap-3 p-4">
        <span
          className={`grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br ${RING[post.accent]} text-sm font-semibold text-white`}
        >
          {post.initials}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium leading-tight">{post.author}</p>
          <p className="text-xs text-muted-foreground">{post.postedAgo}</p>
        </div>
        {place && place.fee === 0 && (
          <Badge className="bg-leaf/15 text-leaf hover:bg-leaf/15">Free spot</Badge>
        )}
      </div>

      <div className="relative aspect-square overflow-hidden">
        <img
          src={post.image}
          alt={`${post.placeName} in ${post.city}, ${post.country}`}
          loading="lazy"
          width={1024}
          height={1024}
          className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
        />
      </div>

      <div className="space-y-3 p-4">
        <p className="text-sm leading-relaxed">{post.caption}</p>

        <p className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
          <MapPin className="h-3.5 w-3.5 text-sunset" />
          <span className="truncate">
            {post.placeName} · {post.city}, {post.country}
          </span>
        </p>

        <div className="flex items-center justify-between border-t pt-3">
          <button
            type="button"
            onClick={() => setLiked((v) => !v)}
            className="press flex items-center gap-1.5 text-xs text-muted-foreground transition hover:text-sunset"
          >
            <Heart
              className={`h-4 w-4 transition ${liked ? "scale-110 fill-sunset text-sunset" : ""}`}
            />
            <span className="tabular-nums">{(post.likes + (liked ? 1 : 0)).toLocaleString()}</span>
          </button>

          {place && (
            <Button
              size="sm"
              variant={added ? "secondary" : "default"}
              className="press"
              onClick={() => {
                if (added) return;
                add({
                  id: place.id,
                  kind: "place",
                  title: place.name,
                  subtitle: `${place.category} · ${post.city}`,
                  price: place.fee,
                  destination: post.city,
                });
                toast.success(`${place.name} added to your basket`);
              }}
            >
              {added ? <Check className="mr-1 h-4 w-4" /> : <Plus className="mr-1 h-4 w-4" />}
              {added ? "In basket" : place.fee === 0 ? "Add free" : `Add $${place.fee}`}
            </Button>
          )}
        </div>
      </div>
    </article>
  );
}

export function TravelerFeed() {
  const [shown, setShown] = useState(6);
  const posts = TRAVELER_POSTS.slice(0, shown);

  return (
    <div className="space-y-10">
      {/* mobile: swipeable row */}
      <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 md:hidden">
        {TRAVELER_POSTS.map((p) => (
          <div key={p.id} className="w-[85%] shrink-0 snap-center">
            <PostCard post={p} />
          </div>
        ))}
      </div>

      {/* desktop: staggered grid */}
      <div className="hidden gap-6 md:grid md:grid-cols-2 lg:grid-cols-3">
        {posts.map((p, i) => (
          <Reveal key={p.id} delay={(i % 3) * 80} className={i % 3 === 1 ? "lg:mt-10" : ""}>
            <PostCard post={p} />
          </Reveal>
        ))}
      </div>

      {shown < TRAVELER_POSTS.length && (
        <div className="hidden justify-center md:flex">
          <Button variant="outline" size="lg" className="press rounded-full" onClick={() => setShown(TRAVELER_POSTS.length)}>
            <ArrowDown className="mr-2 h-4 w-4" /> Load more moments
          </Button>
        </div>
      )}
    </div>
  );
}
