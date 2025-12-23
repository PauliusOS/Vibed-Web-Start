"use client";

import { useState } from "react";
import { ComponentPreview, ComponentGrid, ComponentCard, SectionHeader } from "@/components/f0";
import { FramerCard } from "@/components/framer-analytics";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { ShowcaseCard } from "@/components/ui/showcase-card";
import { motion } from "motion/react";
import { framerCardVariants } from "@/lib/animations";
import { Eye, TrendingUp, Video, Users, Heart, ShoppingCart, Calendar, MapPin, Play, Star, Share2, Bookmark, ExternalLink } from "lucide-react";

const uiCategories = {
  core: {
    name: "Core UI",
    components: ["button", "input", "textarea", "label", "select", "checkbox", "radio-group", "switch", "slider"],
  },
  layout: {
    name: "Layout",
    components: ["card", "showcase-card", "separator", "aspect-ratio", "scroll-area", "resizable", "collapsible"],
  },
  navigation: {
    name: "Navigation",
    components: ["tabs", "breadcrumb", "pagination", "navigation-menu", "menubar", "dropdown-menu", "context-menu"],
  },
  feedback: {
    name: "Feedback",
    components: ["alert", "alert-dialog", "toast", "sonner", "progress", "skeleton"],
  },
  overlay: {
    name: "Overlay",
    components: ["dialog", "sheet", "drawer", "popover", "tooltip", "hover-card"],
  },
  data: {
    name: "Data Display",
    components: ["table", "avatar", "badge", "calendar", "chart"],
  },
  effects: {
    name: "Special Effects",
    components: ["aurora-background", "animated-tooltip", "canvas-reveal-effect", "card-spotlight", "card-hover-effect", "background-gradient"],
  },
  magic: {
    name: "Magic UI",
    components: ["floating-dock", "globe", "lamp", "spotlight", "text-generate-effect", "typewriter-effect", "wavy-background"],
  },
};

export default function F0UISection() {
  const [sliderValue, setSliderValue] = useState([50]);
  const [switchValue, setSwitchValue] = useState(false);
  const [checkboxValue, setCheckboxValue] = useState(false);
  const [showcaseExpanded, setShowcaseExpanded] = useState(false);
  const [productExpanded, setProductExpanded] = useState(false);
  const [eventExpanded, setEventExpanded] = useState(false);
  const [campaignExpanded, setCampaignExpanded] = useState(false);
  const [videoExpanded, setVideoExpanded] = useState(false);
  const [recipeExpanded, setRecipeExpanded] = useState(false);
  const [musicExpanded, setMusicExpanded] = useState(false);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);

  return (
    <div className="space-y-8">
      <SectionHeader
        title="UI Components"
        description="shadcn/ui component library - beautifully designed, accessible components"
        count={112}
        badge="SHADCN/UI"
        badgeColor="blue"
      />

      {/* Button Variants */}
      <ComponentPreview
        name="Button"
        description="Buttons with multiple variants and sizes"
        importPath="@/components/ui/button"
      >
        <div className="flex flex-wrap gap-3">
          <Button>Default</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="link">Link</Button>
          <Button size="sm">Small</Button>
          <Button size="lg">Large</Button>
          <Button disabled>Disabled</Button>
        </div>
      </ComponentPreview>

      {/* Form Controls */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Form Controls</h3>
        <ComponentGrid columns={2}>
          <ComponentPreview name="Input" description="Text input field" importPath="@/components/ui/input">
            <div className="space-y-2">
              <Input placeholder="Enter text..." />
              <Input placeholder="Disabled" disabled />
            </div>
          </ComponentPreview>

          <ComponentPreview name="Select" description="Dropdown select" importPath="@/components/ui/select">
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select option" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="option1">Option 1</SelectItem>
                <SelectItem value="option2">Option 2</SelectItem>
                <SelectItem value="option3">Option 3</SelectItem>
              </SelectContent>
            </Select>
          </ComponentPreview>

          <ComponentPreview name="Switch" description="Toggle switch" importPath="@/components/ui/switch">
            <div className="flex items-center gap-3">
              <Switch checked={switchValue} onCheckedChange={setSwitchValue} />
              <Label>{switchValue ? "On" : "Off"}</Label>
            </div>
          </ComponentPreview>

          <ComponentPreview name="Checkbox" description="Checkbox input" importPath="@/components/ui/checkbox">
            <div className="flex items-center gap-3">
              <Checkbox checked={checkboxValue} onCheckedChange={(v) => setCheckboxValue(!!v)} />
              <Label>Accept terms and conditions</Label>
            </div>
          </ComponentPreview>

          <ComponentPreview name="Slider" description="Range slider" importPath="@/components/ui/slider">
            <div className="space-y-2">
              <Slider value={sliderValue} onValueChange={setSliderValue} max={100} step={1} />
              <p className="text-xs text-white/50 text-center">{sliderValue[0]}%</p>
            </div>
          </ComponentPreview>

          <ComponentPreview name="Progress" description="Progress bar" importPath="@/components/ui/progress">
            <Progress value={66} />
          </ComponentPreview>
        </ComponentGrid>
      </div>

      {/* Display Components */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Display Components</h3>
        <ComponentGrid columns={2}>
          <ComponentPreview name="Badge" description="Status badges" importPath="@/components/ui/badge">
            <div className="flex flex-wrap gap-2">
              <Badge>Default</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="outline">Outline</Badge>
              <Badge variant="destructive">Destructive</Badge>
            </div>
          </ComponentPreview>

          <ComponentPreview name="Avatar" description="User avatar" importPath="@/components/ui/avatar">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <Avatar>
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <Avatar className="h-12 w-12">
                <AvatarFallback className="text-lg">LG</AvatarFallback>
              </Avatar>
            </div>
          </ComponentPreview>

          <ComponentPreview name="Skeleton" description="Loading skeleton" importPath="@/components/ui/skeleton">
            <div className="flex items-center gap-3">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[200px]" />
                <Skeleton className="h-4 w-[160px]" />
              </div>
            </div>
          </ComponentPreview>

          <ComponentPreview name="Separator" description="Visual divider" importPath="@/components/ui/separator">
            <div className="space-y-3">
              <p className="text-sm text-white/60">Content above</p>
              <Separator />
              <p className="text-sm text-white/60">Content below</p>
            </div>
          </ComponentPreview>
        </ComponentGrid>
      </div>

      {/* Card Component */}
      <ComponentPreview name="Card" description="Card container with header, content, and footer" importPath="@/components/ui/card">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Card Title</CardTitle>
            <CardDescription>Card description goes here</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">This is the card content area. You can put any content here.</p>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline">Cancel</Button>
            <Button>Save</Button>
          </CardFooter>
        </Card>
      </ComponentPreview>

      {/* Showcase Card - Framer-style Variations */}
      <ComponentPreview
        name="ShowcaseCard"
        description="Framer-inspired card with progressive blur, asymmetric corners, and expandable content"
        importPath="@/components/ui/showcase-card"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {/* Variation 1: Creator Card */}
          <div>
            <p className="text-xs text-white/40 mb-2 font-medium">Creator Card</p>
            <ShowcaseCard
              title="Sarah Chen"
              subtitle="@sarahcreates · tiktok"
              imageUrl="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop"
              isExpanded={showcaseExpanded}
              onExpandChange={setShowcaseExpanded}
              avatarOverlay={
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-full border-2 border-white/30 overflow-hidden">
                    <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop" className="w-full h-full object-cover" />
                  </div>
                  <span className="text-xs font-medium text-white bg-black/50 backdrop-blur-sm px-2 py-0.5 rounded-full">
                    245K
                  </span>
                </div>
              }
            >
              <motion.div className="grid grid-cols-2 gap-2" variants={framerCardVariants.contentStagger}>
                {[
                  { label: 'Followers', value: '245K', icon: Users },
                  { label: 'Median Views', value: '89K', icon: Eye },
                  { label: 'Engagement', value: '4.2%', icon: TrendingUp },
                  { label: 'Videos', value: '156', icon: Video },
                ].map((stat) => (
                  <motion.div key={stat.label} variants={framerCardVariants.item} className="bg-white/5 rounded-lg p-2.5">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <stat.icon className="w-3 h-3 text-white/60" />
                      <span className="text-[10px] text-white/60">{stat.label}</span>
                    </div>
                    <div className="text-base font-bold text-white">{stat.value}</div>
                  </motion.div>
                ))}
              </motion.div>
              <motion.div className="flex gap-2 mt-3" variants={framerCardVariants.item}>
                <Button size="sm" variant="secondary" className="flex-1 bg-white/10 hover:bg-white/20 text-white border-0 text-xs h-8">View Profile</Button>
                <Button size="sm" variant="secondary" className="flex-1 bg-white/10 hover:bg-white/20 text-white border-0 text-xs h-8">Message</Button>
              </motion.div>
            </ShowcaseCard>
          </div>

          {/* Variation 2: Product Card - Interactive */}
          <div>
            <p className="text-xs text-white/40 mb-2 font-medium">Product Card</p>
            <ShowcaseCard
              title="Wireless Headphones"
              subtitle="Premium Audio · $299"
              imageUrl="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop"
              isExpanded={productExpanded}
              onExpandChange={setProductExpanded}
              avatarOverlay={
                <span className="text-xs font-bold text-white bg-green-500/90 backdrop-blur-sm px-2.5 py-1 rounded-full">
                  New
                </span>
              }
            >
              <motion.div variants={framerCardVariants.contentStagger} className="space-y-3">
                <motion.div variants={framerCardVariants.item} className="flex items-center gap-1">
                  {[1,2,3,4,5].map((i) => (
                    <Star key={i} className={cn("w-4 h-4", i <= 4 ? "text-yellow-400 fill-yellow-400" : "text-white/30")} />
                  ))}
                  <span className="text-xs text-white/60 ml-1">4.8 (2.4k reviews)</span>
                </motion.div>
                <motion.p variants={framerCardVariants.item} className="text-xs text-white/70">
                  Premium noise-canceling headphones with 30-hour battery life.
                </motion.p>
                <motion.div variants={framerCardVariants.item} className="flex gap-2">
                  <Button size="sm" className="flex-1 bg-white text-black hover:bg-white/90 text-xs h-8">
                    <ShoppingCart className="w-3 h-3 mr-1.5" />Add to Cart
                  </Button>
                  <Button size="sm" variant="ghost" className="text-white/70 hover:text-white hover:bg-white/10 h-8 px-2" onClick={() => setLiked(!liked)}>
                    <Heart className={cn("w-4 h-4", liked && "fill-red-500 text-red-500")} />
                  </Button>
                </motion.div>
              </motion.div>
            </ShowcaseCard>
          </div>

          {/* Variation 3: Event Card - Interactive */}
          <div>
            <p className="text-xs text-white/40 mb-2 font-medium">Event Card</p>
            <ShowcaseCard
              title="Creator Summit 2025"
              subtitle="Jan 15-17 · San Francisco"
              imageUrl="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=400&fit=crop"
              isExpanded={eventExpanded}
              onExpandChange={setEventExpanded}
              avatarOverlay={
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-xs font-medium text-white bg-black/50 backdrop-blur-sm px-2 py-0.5 rounded-full">
                    Live
                  </span>
                </div>
              }
            >
              <motion.div variants={framerCardVariants.contentStagger} className="space-y-3">
                <motion.div variants={framerCardVariants.item} className="flex items-center gap-4 text-xs text-white/70">
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> Jan 15-17</span>
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> SF, CA</span>
                </motion.div>
                <motion.p variants={framerCardVariants.item} className="text-xs text-white/70">
                  Join 500+ creators for networking, workshops, and keynotes.
                </motion.p>
                <motion.div variants={framerCardVariants.item} className="flex gap-2">
                  <Button size="sm" className="flex-1 bg-cyan-500 hover:bg-cyan-600 text-white text-xs h-8">Register Now</Button>
                  <Button size="sm" variant="ghost" className="text-white/70 hover:text-white hover:bg-white/10 h-8 px-2" onClick={() => setSaved(!saved)}>
                    <Bookmark className={cn("w-4 h-4", saved && "fill-white")} />
                  </Button>
                </motion.div>
              </motion.div>
            </ShowcaseCard>
          </div>

          {/* Variation 4: Campaign Card - Interactive */}
          <div>
            <p className="text-xs text-white/40 mb-2 font-medium">Campaign Card</p>
            <ShowcaseCard
              title="Summer Collection"
              subtitle="Fashion Brand · 12 creators"
              imageUrl="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop"
              isExpanded={campaignExpanded}
              onExpandChange={setCampaignExpanded}
              avatarOverlay={
                <div className="flex -space-x-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="w-7 h-7 rounded-full border-2 border-black/30 bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                      <span className="text-white text-[10px] font-medium">{i}</span>
                    </div>
                  ))}
                  <div className="w-7 h-7 rounded-full border-2 border-black/30 bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <span className="text-white text-[10px] font-medium">+9</span>
                  </div>
                </div>
              }
            >
              <motion.div variants={framerCardVariants.contentStagger} className="space-y-3">
                <motion.div variants={framerCardVariants.item}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-white/60">Progress</span>
                    <span className="text-white">75%</span>
                  </div>
                  <Progress value={75} className="h-1.5" />
                </motion.div>
                <motion.div variants={framerCardVariants.item} className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-white/5 rounded-lg p-2">
                    <div className="text-sm font-bold text-white">12</div>
                    <div className="text-[10px] text-white/50">Creators</div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-2">
                    <div className="text-sm font-bold text-white">48</div>
                    <div className="text-[10px] text-white/50">Videos</div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-2">
                    <div className="text-sm font-bold text-white">2.1M</div>
                    <div className="text-[10px] text-white/50">Views</div>
                  </div>
                </motion.div>
                <motion.div variants={framerCardVariants.item}>
                  <Button size="sm" className="w-full bg-white/10 hover:bg-white/20 text-white text-xs h-8">
                    <ExternalLink className="w-3 h-3 mr-1.5" />View Campaign
                  </Button>
                </motion.div>
              </motion.div>
            </ShowcaseCard>
          </div>

          {/* Variation 5: Video Card - Interactive */}
          <div>
            <p className="text-xs text-white/40 mb-2 font-medium">Video Card</p>
            <ShowcaseCard
              title="How to Edit Like a Pro"
              subtitle="Tutorial · 12 min"
              imageUrl="https://images.unsplash.com/photo-1536240478700-b869070f9279?w=400&h=400&fit=crop"
              isExpanded={videoExpanded}
              onExpandChange={setVideoExpanded}
              avatarOverlay={
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm">
                  <Play className="w-5 h-5 text-white fill-white" />
                </div>
              }
            >
              <motion.div variants={framerCardVariants.contentStagger} className="space-y-3">
                <motion.div variants={framerCardVariants.item} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                    <span className="text-white text-xs font-bold">JD</span>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-white">John Doe</p>
                    <p className="text-[10px] text-white/50">1.2M subscribers</p>
                  </div>
                </motion.div>
                <motion.div variants={framerCardVariants.item} className="flex items-center gap-4 text-xs text-white/60">
                  <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> 245K views</span>
                  <span className="flex items-center gap-1"><Heart className="w-3 h-3" /> 12K likes</span>
                </motion.div>
                <motion.div variants={framerCardVariants.item} className="flex gap-2">
                  <Button size="sm" className="flex-1 bg-red-500 hover:bg-red-600 text-white text-xs h-8">
                    <Play className="w-3 h-3 mr-1.5 fill-white" />Watch Now
                  </Button>
                  <Button size="sm" variant="ghost" className="text-white/70 hover:text-white hover:bg-white/10 h-8 px-2">
                    <Share2 className="w-4 h-4" />
                  </Button>
                </motion.div>
              </motion.div>
            </ShowcaseCard>
          </div>

          {/* Variation 6: Recipe Card - Interactive */}
          <div>
            <p className="text-xs text-white/40 mb-2 font-medium">Recipe Card</p>
            <ShowcaseCard
              title="Spicy Ramen Bowl"
              subtitle="Japanese · 30 min"
              imageUrl="https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=400&fit=crop"
              isExpanded={recipeExpanded}
              onExpandChange={setRecipeExpanded}
              avatarOverlay={
                <div className="flex items-center gap-1">
                  {[1,2,3,4,5].map((i) => (
                    <Star key={i} className={cn("w-3 h-3", i <= 4 ? "text-yellow-400 fill-yellow-400" : "text-white/30")} />
                  ))}
                </div>
              }
            >
              <motion.div variants={framerCardVariants.contentStagger} className="space-y-3">
                <motion.div variants={framerCardVariants.item} className="flex gap-3 text-xs">
                  <div className="bg-white/5 rounded-lg px-2.5 py-1.5 flex items-center gap-1">
                    <span className="text-white/60">Prep:</span>
                    <span className="text-white font-medium">15m</span>
                  </div>
                  <div className="bg-white/5 rounded-lg px-2.5 py-1.5 flex items-center gap-1">
                    <span className="text-white/60">Cook:</span>
                    <span className="text-white font-medium">15m</span>
                  </div>
                  <div className="bg-white/5 rounded-lg px-2.5 py-1.5 flex items-center gap-1">
                    <span className="text-white/60">Serves:</span>
                    <span className="text-white font-medium">2</span>
                  </div>
                </motion.div>
                <motion.div variants={framerCardVariants.item}>
                  <Button size="sm" className="w-full bg-orange-500 hover:bg-orange-600 text-white text-xs h-8">
                    View Recipe
                  </Button>
                </motion.div>
              </motion.div>
            </ShowcaseCard>
          </div>

          {/* Variation 7: Music Card - Interactive */}
          <div>
            <p className="text-xs text-white/40 mb-2 font-medium">Music Card</p>
            <ShowcaseCard
              title="Midnight Dreams"
              subtitle="Chillwave · 3:45"
              imageUrl="https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop"
              isExpanded={musicExpanded}
              onExpandChange={setMusicExpanded}
              avatarOverlay={
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full overflow-hidden border border-white/20">
                    <img src="https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=100&h=100&fit=crop" className="w-full h-full object-cover" />
                  </div>
                </div>
              }
            >
              <motion.div variants={framerCardVariants.contentStagger} className="space-y-3">
                <motion.div variants={framerCardVariants.item}>
                  <Slider defaultValue={[33]} max={100} step={1} className="w-full" />
                  <div className="flex justify-between text-[10px] text-white/50 mt-1">
                    <span>1:14</span>
                    <span>3:45</span>
                  </div>
                </motion.div>
                <motion.div variants={framerCardVariants.item} className="flex items-center justify-center gap-4">
                  <Button size="sm" variant="ghost" className="text-white/70 hover:text-white h-8 w-8 p-0">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/></svg>
                  </Button>
                  <Button size="sm" className="bg-green-500 hover:bg-green-600 text-white h-10 w-10 rounded-full p-0">
                    <Play className="w-5 h-5 fill-white ml-0.5" />
                  </Button>
                  <Button size="sm" variant="ghost" className="text-white/70 hover:text-white h-8 w-8 p-0">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/></svg>
                  </Button>
                </motion.div>
              </motion.div>
            </ShowcaseCard>
          </div>

          {/* Variation 8: Gradient Fallback */}
          <div>
            <p className="text-xs text-white/40 mb-2 font-medium">Gradient Fallback</p>
            <ShowcaseCard
              title="AI Assistant"
              subtitle="Coming Soon"
              imageFallback={
                <div className="w-full h-full bg-gradient-to-br from-violet-600 via-purple-500 to-fuchsia-500 flex items-center justify-center">
                  <span className="text-white text-4xl font-bold">AI</span>
                </div>
              }
              avatarOverlay={
                <span className="text-xs font-medium text-white bg-violet-500/80 backdrop-blur-sm px-2 py-0.5 rounded-full">
                  Beta
                </span>
              }
              hideExpandButton
            />
          </div>
        </div>
      </ComponentPreview>

      {/* Tabs Component */}
      <ComponentPreview name="Tabs" description="Tab navigation" importPath="@/components/ui/tabs">
        <Tabs defaultValue="tab1" className="w-full">
          <TabsList>
            <TabsTrigger value="tab1">Account</TabsTrigger>
            <TabsTrigger value="tab2">Password</TabsTrigger>
            <TabsTrigger value="tab3">Settings</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1" className="p-4 border rounded-lg mt-2">
            <p className="text-sm text-white/60">Account settings content</p>
          </TabsContent>
          <TabsContent value="tab2" className="p-4 border rounded-lg mt-2">
            <p className="text-sm text-white/60">Password settings content</p>
          </TabsContent>
          <TabsContent value="tab3" className="p-4 border rounded-lg mt-2">
            <p className="text-sm text-white/60">General settings content</p>
          </TabsContent>
        </Tabs>
      </ComponentPreview>

      {/* All UI Components by Category */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">All Components by Category</h3>
        <div className="space-y-4">
          {Object.entries(uiCategories).map(([key, category]) => (
            <FramerCard key={key}>
              <h4 className="text-sm font-medium text-white mb-3">{category.name}</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-2">
                {category.components.map((name) => (
                  <ComponentCard key={name} name={name} importPath={`@/components/ui/${name}`} color="blue" />
                ))}
              </div>
            </FramerCard>
          ))}
        </div>
      </div>
    </div>
  );
}
