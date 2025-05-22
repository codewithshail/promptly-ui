'use client'
import { Suspense } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { PrimarySidebar } from '@/components/layout/sidebar/primary-sidebar';
import { ContextualSidebar } from '@/components/layout/sidebar/contextual-sidebar';
import { CategoryCarousel } from '@/components/layout/navigation/category-carousel';
import { ToolGrid } from '@/components/tools/tool-grid';
import { ToolCard } from '@/components/tools/tool-card';
import { FeatureBanner } from '@/components/layout/feature-banner/page';
import { drizzle } from 'drizzle-orm/neon-http';
import { categoriesRelations, db } from '@/lib/db'

import {tools, categories, toolCategories} from '@/lib/db/index'
// Comprehensive category data with tools
// const categories = [
//   {
//     id: '1',
//     name: 'For You',
//     icon: '✨',
//     tools: [
//       {
//         id: '101',
//         name: 'AI Text to Speech',
//         href: '/apps/101',
//       },
//       {
//         id: '102',
//         name: 'Image Generator',
//         href: '/apps/102',
//       },
//       {
//         id: '103',
//         name: 'Content Writer',
//         href: '/apps/103',
//       }
//     ]
//   },
//   {
//     id: '2',
//     name: 'Text Generation',
//     icon: '📝',
//     tools: [
//       {
//         id: '201',
//         name: 'Blog Writer',
//         href: '/apps/201',
//       },
//       {
//         id: '202',
//         name: 'Email Composer',
//         href: '/apps/202',
//       },
//       {
//         id: '203',
//         name: 'Social Media Post Generator',
//         href: '/apps/203',
//       },
//       {
//         id: '204',
//         name: 'Product Description Writer',
//         href: '/apps/204',
//       },
//       {
//         id: '205',
//         name: 'Resume Builder',
//         href: '/apps/205',
//       }
//     ]
//   },
//   {
//     id: '3',
//     name: 'Image Generation',
//     icon: '🖼️',
//     tools: [
//       {
//         id: '301',
//         name: 'Portrait Generator',
//         href: '/apps/301',
//       },
//       {
//         id: '302',
//         name: 'Logo Creator',
//         href: '/apps/302',
//       },
//       {
//         id: '303',
//         name: 'Background Remover',
//         href: '/apps/303',
//       },
//       {
//         id: '304',
//         name: 'Image Upscaler',
//         href: '/apps/304',
//       }
//     ]
//   },
//   {
//     id: '4',
//     name: 'Audio & Voice',
//     icon: '🔊',
//     tools: [
//       {
//         id: '401',
//         name: 'Voice Cloning',
//         href: '/apps/401',
//       },
//       {
//         id: '402',
//         name: 'Audio Transcription',
//         href: '/apps/402',
//       },
//       {
//         id: '403',
//         name: 'Podcast Generator',
//         href: '/apps/403',
//       },
//       {
//         id: '404',
//         name: 'Music Composer',
//         href: '/apps/404',
//       }
//     ]
//   },
//   {
//     id: '5',
//     name: 'Video Creation',
//     icon: '🎬',
//     tools: [
//       {
//         id: '501',
//         name: 'Video Generator',
//         href: '/apps/501',
//       },
//       {
//         id: '502',
//         name: 'Animation Creator',
//         href: '/apps/502',
//       },
//       {
//         id: '503',
//         name: 'Video Summarizer',
//         href: '/apps/503',
//       }
//     ]
//   },
//   {
//     id: '6',
//     name: 'Code & Development',
//     icon: '💻',
//     tools: [
//       {
//         id: '601',
//         name: 'Code Assistant',
//         href: '/apps/601',
//       },
//       {
//         id: '602',
//         name: 'Bug Fixer',
//         href: '/apps/602',
//       },
//       {
//         id: '603',
//         name: 'API Documentation Generator',
//         href: '/apps/603',
//       }
//     ]
//   },
//   {
//     id: '7',
//     name: 'Business',
//     icon: '💼',
//     tools: [
//       {
//         id: '701',
//         name: 'Business Plan Generator',
//         href: '/apps/701',
//       },
//       {
//         id: '702',
//         name: 'Financial Analyst',
//         href: '/apps/702',
//       },
//       {
//         id: '703',
//         name: 'Market Research Assistant',
//         href: '/apps/703',
//       }
//     ]
//   },
//   {
//     id: '8',
//     name: 'Education',
//     icon: '🎓',
//     tools: [
//       {
//         id: '801',
//         name: 'Study Guide Creator',
//         href: '/apps/801',
//       },
//       {
//         id: '802',
//         name: 'Quiz Generator',
//         href: '/apps/802',
//       },
//       {
//         id: '803',
//         name: 'Language Tutor',
//         href: '/apps/803',
//       }
//     ]
//   }
// ];

// // Tool data with category associations
// const toolsData = [
//   // Text Generation Tools
//   {
//     id: '201',
//     name: 'Blog Writer',
//     description: 'Generate engaging blog posts on any topic',
//     subtitle: 'AI-powered blog content creator',
//     logo: '/images/tools/blog-writer.png',
//     generationType: 'Text',
//     isNew: false,
//     categories: ['2']
//   },
//   {
//     id: '202',
//     name: 'Email Composer',
//     description: 'Create professional emails for any business scenario',
//     subtitle: 'Professional email generator',
//     logo: '/images/tools/email-composer.png',
//     generationType: 'Text',
//     isNew: false,
//     categories: ['2']
//   },
//   {
//     id: '203',
//     name: 'Social Media Post Generator',
//     description: 'Create engaging posts for all social platforms',
//     subtitle: 'Platform-specific content creator',
//     logo: '/images/tools/social-post.png',
//     generationType: 'Text',
//     isNew: true,
//     categories: ['2']
//   },
//   {
//     id: '204',
//     name: 'Product Description Writer',
//     description: 'Generate compelling product descriptions that sell',
//     subtitle: 'E-commerce copy generator',
//     logo: '/images/tools/product-desc.png',
//     generationType: 'Text',
//     isNew: false,
//     categories: ['2']
//   },
//   {
//     id: '205',
//     name: 'Resume Builder',
//     description: 'Create professional resumes tailored to job descriptions',
//     subtitle: 'Career document generator',
//     logo: '/images/tools/resume-builder.png',
//     generationType: 'Text',
//     isNew: false,
//     categories: ['2']
//   },
  
//   // Image Generation Tools
//   {
//     id: '301',
//     name: 'Portrait Generator',
//     description: 'Create realistic portraits of people who don\'t exist',
//     subtitle: 'AI portrait creator',
//     logo: '/images/tools/portrait-gen.png',
//     generationType: 'Image',
//     isNew: false,
//     categories: ['3']
//   },
//   {
//     id: '302',
//     name: 'Logo Creator',
//     description: 'Generate unique logos for your brand or business',
//     subtitle: 'Brand identity generator',
//     logo: '/images/tools/logo-creator.png',
//     generationType: 'Image',
//     isNew: true,
//     categories: ['3']
//   },
//   {
//     id: '303',
//     name: 'Background Remover',
//     description: 'Automatically remove backgrounds from any image',
//     subtitle: 'Image background eraser',
//     logo: '/images/tools/bg-remover.png',
//     generationType: 'Image',
//     isNew: false,
//     categories: ['3']
//   },
//   {
//     id: '304',
//     name: 'Image Upscaler',
//     description: 'Enhance low-resolution images to high quality',
//     subtitle: 'Resolution enhancer',
//     logo: '/images/tools/upscaler.png',
//     generationType: 'Image',
//     isNew: false,
//     categories: ['3']
//   },
  
//   // Audio & Voice Tools
//   {
//     id: '401',
//     name: 'Voice Cloning',
//     description: 'Create a digital copy of your voice or custom voices',
//     subtitle: 'Personal voice replication',
//     logo: '/images/tools/voice-clone.png',
//     generationType: 'Audio',
//     isNew: true,
//     categories: ['4']
//   },
//   {
//     id: '402',
//     name: 'Audio Transcription',
//     description: 'Convert audio to text with high accuracy',
//     subtitle: 'Speech-to-text converter',
//     logo: '/images/tools/transcription.png',
//     generationType: 'Audio',
//     isNew: false,
//     categories: ['4']
//   },
//   {
//     id: '403',
//     name: 'Podcast Generator',
//     description: 'Create podcast episodes from text scripts',
//     subtitle: 'Text-to-podcast converter',
//     logo: '/images/tools/podcast-gen.png',
//     generationType: 'Audio',
//     isNew: true,
//     categories: ['4']
//   },
//   {
//     id: '404',
//     name: 'Music Composer',
//     description: 'Generate original music in various styles',
//     subtitle: 'AI music creation',
//     logo: '/images/tools/music-composer.png',
//     generationType: 'Audio',
//     isNew: false,
//     categories: ['4']
//   }
// ];

// // Feature banners
const featureBanners = [
  {
    id: '1',
    title: 'Voice Cloning Technology',
    description: 'Create a digital copy of your voice in minutes',
    buttonText: 'Try Voice Cloning',
    buttonLink: '/apps/401',
    image: '/images/features/voice-clone-banner.png',
    bgColor: 'bg-blue-600'
  },
  {
    id: '2',
    title: 'Logo Creator',
    description: 'Generate unique logos for your brand in seconds',
    buttonText: 'Create Your Logo',
    buttonLink: '/apps/302',
    image: '/images/features/logo-creator-banner.png',
    bgColor: 'bg-purple-600'
  },
  {
    id: '3',
    title: 'Social Media Content Generator',
    description: 'Create engaging posts for all platforms instantly',
    buttonText: 'Generate Content',
    buttonLink: '/apps/203',
    image: '/images/features/social-media-banner.png',
    bgColor: 'bg-green-600'
  }
];

export default async function AppsPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  // In Next.js App Router, searchParams is already resolved, no need to await it
  // But we should ensure we're handling it properly
  // Get search params with proper type checking
  const search = typeof searchParams?.search === 'string' ? searchParams.search.toLowerCase() : null;
  // const params = searchParams || {};
  // const categoryParam = typeof params.category === 'string' ? params.category : undefined;
  // const searchParam = typeof params.search === 'string' ? params.search : undefined;
  
  // Filter tools based on search params
  // let filteredTools = [...toolsData];
  
  // if (categoryParam) {
  //   // Find the category by name
  //   const selectedCategory = categories.find(c => 
  //     c.name.toLowerCase() === categoryParam.toLowerCase()
  //   );
    
  //   if (selectedCategory) {
  //     // Filter tools by category ID
  //     filteredTools = filteredTools.filter(tool => 
  //       tool.categories?.includes(selectedCategory.id)
  //     );
  //   }
  // }
  
  // if (searchParam) {
  //   const searchTerm = searchParam.toLowerCase();
  //   filteredTools = filteredTools.filter(tool => 
  //     tool.name.toLowerCase().includes(searchTerm) || 
  //     tool.description.toLowerCase().includes(searchTerm) ||
  //     (tool.subtitle && tool.subtitle.toLowerCase().includes(searchTerm))
  //   );
  // }
  

   // Fetch all categories
  const allCategories = await db.select().from(categories);

  // For each category, fetch related tools
  const categoriesWithTools = await Promise.all(
    allCategories.map(async (category) => {
      const mapping = await db.query.toolCategories.findMany({
        where: (mapping, { eq }) => eq(mapping.categoryId, category.id),
        with: {
          tool: true,
        },
      });

      // Optional search filter
      const filteredTools = mapping
        .map(m => m.tool)
        .filter(tool => {
          if (!search) return true;
          return (
            tool.name.toLowerCase().includes(search) ||
            tool.description.toLowerCase().includes(search) ||
            (tool.subtitle && tool.subtitle.toLowerCase().includes(search))
          );
        });

      return {
        ...category,
        tools: filteredTools,
      };
    })
  );

  return (
    <div className="flex h-screen">
      <ContextualSidebar 
        type="apps"
        categories={allCategories}
      />
      <main className="flex-1 overflow-auto">
        <div className="container mx-auto py-6 space-y-6">
          {/* Feature Banner */}
          <FeatureBanner features={featureBanners} />
          
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="relative flex-1 max-w-xl">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <form action="/apps" method="GET">
                <Input 
                  name="search"
                  placeholder="Search for AI tools..." 
                  className="pl-10"
                  defaultValue={search || ''}
                />
              </form>
            </div>
            
          </div>
          
          <Suspense fallback={<div>Loading tools...</div>}>
            {categoriesWithTools.map(category => (
  <div key={category.id} className="space-y-4">
    <h2 className="text-xl font-semibold flex items-center gap-2">
      <span>{category.icon}</span> {category.name}
    </h2>

    {category.tools.length > 0 ? (
      <ToolGrid>
        {category.tools.map(tool => (
          
          <ToolCard key={tool.id} tool={tool} />
        ))}
      </ToolGrid>
    ) : (
      <p className="text-muted-foreground">No tools in this category</p>
    )}
  </div>
)
)}
          </Suspense>
        </div>
      </main>
    </div>
  );
}