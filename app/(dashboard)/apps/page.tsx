"use client";

import { useState } from "react";
import Image from "next/image";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Search } from 'lucide-react';

type Tool = {
  id: string;
  name: string;
  description: string;
  subtitle?: string;
  logo: string;
  preview: string;
  generationType: string;
  isNew: boolean;
  categories: string[];
};

type Category = {
  id: string;
  name: string;
  icon: string;
  tools?: {
    id: string;
    name: string;
    href: string;
  }[];
};

type FeatureBanner = {
  id: string;
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  image: string;
  bgColor: string;
};

// Comprehensive category data with tools
const categories: Category[] = [
  {
    id: '1',
    name: 'For You',
    icon: '✨',
    tools: [
      {
        id: '101',
        name: 'AI Text to Speech',
        href: '/apps/101',
      },
      {
        id: '102',
        name: 'Image Generator',
        href: '/apps/102',
      },
      {
        id: '103',
        name: 'Content Writer',
        href: '/apps/103',
      }
    ]
  },
  {
    id: '2',
    name: 'Text Generation',
    icon: '📝',
    tools: [
      {
        id: '201',
        name: 'Blog Writer',
        href: '/apps/201',
      },
      {
        id: '202',
        name: 'Email Composer',
        href: '/apps/202',
      },
      {
        id: '203',
        name: 'Social Media Post Generator',
        href: '/apps/203',
      },
      {
        id: '204',
        name: 'Product Description Writer',
        href: '/apps/204',
      },
      {
        id: '205',
        name: 'Resume Builder',
        href: '/apps/205',
      }
    ]
  },
  {
    id: '3',
    name: 'Image Generation',
    icon: '🖼️',
    tools: [
      {
        id: '301',
        name: 'Portrait Generator',
        href: '/apps/301',
      },
      {
        id: '302',
        name: 'Logo Creator',
        href: '/apps/302',
      },
      {
        id: '303',
        name: 'Background Remover',
        href: '/apps/303',
      },
      {
        id: '304',
        name: 'Image Upscaler',
        href: '/apps/304',
      }
    ]
  },
  {
    id: '4',
    name: 'Audio & Voice',
    icon: '🔊',
    tools: [
      {
        id: '401',
        name: 'Voice Cloning',
        href: '/apps/401',
      },
      {
        id: '402',
        name: 'Audio Transcription',
        href: '/apps/402',
      },
      {
        id: '403',
        name: 'Podcast Generator',
        href: '/apps/403',
      },
      {
        id: '404',
        name: 'Music Composer',
        href: '/apps/404',
      }
    ]
  },
  {
    id: '5',
    name: 'Video Creation',
    icon: '🎬',
    tools: [
      {
        id: '501',
        name: 'Video Generator',
        href: '/apps/501',
      },
      {
        id: '502',
        name: 'Animation Creator',
        href: '/apps/502',
      },
      {
        id: '503',
        name: 'Video Summarizer',
        href: '/apps/503',
      }
    ]
  },
  {
    id: '6',
    name: 'Code & Development',
    icon: '💻',
    tools: [
      {
        id: '601',
        name: 'Code Assistant',
        href: '/apps/601',
      },
      {
        id: '602',
        name: 'Bug Fixer',
        href: '/apps/602',
      },
      {
        id: '603',
        name: 'API Documentation Generator',
        href: '/apps/603',
      }
    ]
  },
  {
    id: '7',
    name: 'Business',
    icon: '💼',
    tools: [
      {
        id: '701',
        name: 'Business Plan Generator',
        href: '/apps/701',
      },
      {
        id: '702',
        name: 'Financial Analyst',
        href: '/apps/702',
      },
      {
        id: '703',
        name: 'Market Research Assistant',
        href: '/apps/703',
      }
    ]
  },
  {
    id: '8',
    name: 'Education',
    icon: '🎓',
    tools: [
      {
        id: '801',
        name: 'Study Guide Creator',
        href: '/apps/801',
      },
      {
        id: '802',
        name: 'Quiz Generator',
        href: '/apps/802',
      },
      {
        id: '803',
        name: 'Language Tutor',
        href: '/apps/803',
      }
    ]
  }
];

// Tool data with category associations
const toolsData: Tool[] = [
  // Text Generation Tools
  {
    id: '201',
    name: 'Blog Writer',
    description: 'Generate engaging blog posts on any topic',
    subtitle: 'AI-powered blog content creator',
    logo: '/images/tools/blog-writer.png',
    preview: '/images/previews/blog-writer.png',
    generationType: 'Text',
    isNew: false,
    categories: ['2']
  },
  {
    id: '202',
    name: 'Email Composer',
    description: 'Create professional emails for any business scenario',
    subtitle: 'Professional email generator',
    logo: '/images/tools/email-composer.png',
    preview: '/images/previews/email-composer.png',
    generationType: 'Text',
    isNew: false,
    categories: ['2']
  },
  {
    id: '203',
    name: 'Social Media Post Generator',
    description: 'Create engaging posts for all social platforms',
    subtitle: 'Platform-specific content creator',
    logo: '/images/tools/social-post.png',
    preview: '/images/previews/social-post.png',
    generationType: 'Text',
    isNew: true,
    categories: ['2']
  },
  {
    id: '204',
    name: 'Product Description Writer',
    description: 'Generate compelling product descriptions that sell',
    subtitle: 'E-commerce copy generator',
    logo: '/images/tools/product-desc.png',
    preview: '/images/previews/product-desc.png',
    generationType: 'Text',
    isNew: false,
    categories: ['2']
  },
  {
    id: '205',
    name: 'Resume Builder',
    description: 'Create professional resumes tailored to job descriptions',
    subtitle: 'Career document generator',
    logo: '/images/tools/resume-builder.png',
    preview: '/images/previews/resume-builder.png',
    generationType: 'Text',
    isNew: false,
    categories: ['2']
  },
  
  // Image Generation Tools
  {
    id: '301',
    name: 'Portrait Generator',
    description: 'Create realistic portraits of people who don\'t exist',
    subtitle: 'AI portrait creator',
    logo: '/images/tools/portrait-gen.png',
    preview: '/images/previews/portrait-gen.png',
    generationType: 'Image',
    isNew: false,
    categories: ['3']
  },
  {
    id: '302',
    name: 'Logo Creator',
    description: 'Generate unique logos for your brand or business',
    subtitle: 'Brand identity generator',
    logo: '/images/tools/logo-creator.png',
    preview: '/images/previews/logo-creator.png',
    generationType: 'Image',
    isNew: true,
    categories: ['3']
  },
  {
    id: '303',
    name: 'Background Remover',
    description: 'Automatically remove backgrounds from any image',
    subtitle: 'Image background eraser',
    logo: '/images/tools/bg-remover.png',
    preview: '/images/previews/bg-remover.png',
    generationType: 'Image',
    isNew: false,
    categories: ['3']
  },
  {
    id: '304',
    name: 'Image Upscaler',
    description: 'Enhance low-resolution images to high quality',
    subtitle: 'Resolution enhancer',
    logo: '/images/tools/upscaler.png',
    preview: '/images/previews/upscaler.png',
    generationType: 'Image',
    isNew: false,
    categories: ['3']
  },
  
  // Audio & Voice Tools
  {
    id: '401',
    name: 'Voice Cloning',
    description: 'Create a digital copy of your voice or custom voices',
    subtitle: 'Personal voice replication',
    logo: '/images/tools/voice-clone.png',
    preview: '/images/previews/voice-clone.png',
    generationType: 'Audio',
    isNew: true,
    categories: ['4']
  },
  {
    id: '402',
    name: 'Audio Transcription',
    description: 'Convert audio to text with high accuracy',
    subtitle: 'Speech-to-text converter',
    logo: '/images/tools/transcription.png',
    preview: '/images/previews/transcription.png',
    generationType: 'Audio',
    isNew: false,
    categories: ['4']
  },
  {
    id: '403',
    name: 'Podcast Generator',
    description: 'Create podcast episodes from text scripts',
    subtitle: 'Text-to-podcast converter',
    logo: '/images/tools/podcast-gen.png',
    preview: '/images/previews/podcast-gen.png',
    generationType: 'Audio',
    isNew: true,
    categories: ['4']
  },
  {
    id: '404',
    name: 'Music Composer',
    description: 'Generate original music in various styles',
    subtitle: 'AI music creation',
    logo: '/images/tools/music-composer.png',
    preview: '/images/previews/music-composer.png',
    generationType: 'Audio',
    isNew: false,
    categories: ['4']
  }
];

// Feature banners
const featureBanners: FeatureBanner[] = [
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

export default function SearchPage() {
  const [activeCategory, setActiveCategory] = useState('For You');
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleCounts, setVisibleCounts] = useState<Record<string, number>>({});

  const settings = {
    dots: true,
    arrows: false,
    infinite: true,
    autoplay: true,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  // Filter tools based on active category and search query
  const filteredTools = toolsData.filter(
    (tool) => {
      const categoryMatch = categories.find(cat => 
        cat.name === activeCategory && tool.categories.includes(cat.id)
      );
      
      const searchMatch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (tool.subtitle && tool.subtitle.toLowerCase().includes(searchQuery.toLowerCase()));
      
      return categoryMatch && searchMatch;
    }
  );

  // Group tools by generation type (subcategory)
  const groupedTools: Record<string, Tool[]> = {};
  filteredTools.forEach((tool) => {
    const subcategory = tool.generationType;
    if (!groupedTools[subcategory]) groupedTools[subcategory] = [];
    groupedTools[subcategory].push(tool);
  });

  const handleSeeMore = (sub: string) => {
    setVisibleCounts((prev) => ({
      ...prev,
      [sub]: (prev[sub] || 8) + 8,
    }));
  };

  const handleCollapse = (sub: string) => {
    setVisibleCounts((prev) => ({
      ...prev,
      [sub]: 8,
    }));
  };

  return (
    <div className="font-sans">
      {/* Banner */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Slider {...settings}>
          {featureBanners.map((slide, idx) => (
            <div key={idx}>
              <div className={`${slide.bgColor} rounded-xl p-6 md:flex md:items-center md:justify-between`}>
                <div className="md:w-1/2 space-y-3">
                  <span className="bg-gray-700 text-white text-xs font-semibold px-2 py-1 rounded-md">
                    Featured
                  </span>
                  <h2 className="text-2xl md:text-3xl font-semibold text-gray-900">
                    {slide.title}
                  </h2>
                  <p className="text-gray-700">{slide.description}</p>
                  <button 
                    className="mt-4 bg-[#9333EA] text-white px-4 py-2 rounded-md shadow-md hover:bg-[#7e22ce] transition"
                    onClick={() => window.location.href = slide.buttonLink}
                  >
                    {slide.buttonText}
                  </button>
                </div>
                <div className="md:w-1/2 mt-6 md:mt-0 flex justify-end">
                  <div className="relative w-[200px] h-[200px] rounded-lg overflow-hidden shadow-lg">
                    <Image
                      src={slide.image}
                      alt="Slide image"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>

      {/* Search + Tools */}
      <div className="px-6 py-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
          <div className="relative flex-1 max-w-xl">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for AI tools..."
              className="w-full pl-10 p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div className="flex overflow-x-auto space-x-2 scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.name)}
                className={`whitespace-nowrap px-4 py-2 rounded-full border text-sm font-medium ${
                  activeCategory === cat.name
                    ? "bg-purple-100 text-purple-800 border-purple-300"
                    : "bg-white text-gray-700 border-gray-300"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 mb-4">
          <h2 className="text-2xl font-semibold text-gray-900">
            {activeCategory}
          </h2>
          <p className="text-sm text-gray-600">
            Explore top AI tools under &quot;{activeCategory}&quot;
          </p>
        </div>

        {Object.entries(groupedTools).map(([sub, list]) => {
          const visibleCount = visibleCounts[sub] || 8;
          return (
            <div key={sub} className="mb-10">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">{sub}</h3>
                <div className="flex items-center space-x-2">
                  {list.length > visibleCount && (
                    <button
                      onClick={() => handleSeeMore(sub)}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      See all
                    </button>
                  )}
                  {visibleCount > 8 && (
                    <button
                      onClick={() => handleCollapse(sub)}
                      className="text-gray-500 hover:text-gray-700"
                      title="Collapse"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="w-5 h-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 15l7-7 7 7"
                        />
                      </svg>
                    </button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-4">
                {list.slice(0, visibleCount).map((tool) => (
                  <div
                    key={tool.id}
                    className="flex items-start gap-4 p-3 rounded-lg hover:bg-gray-50 transition cursor-pointer"
                    onClick={() => setSelectedTool(tool)}
                  >
                    <div className="min-w-[48px] min-h-[48px] relative rounded overflow-hidden">
                      <Image
                        src={tool.logo}
                        alt={tool.name}
                        width={48}
                        height={48}
                        className="object-contain rounded"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-gray-900 leading-tight">
                        {tool.name}
                        {tool.isNew && (
                          <span className="ml-2 bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full">
                            New
                          </span>
                        )}
                      </h4>
                      <p className="text-sm text-gray-600 leading-snug">
                        {tool.subtitle || tool.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {selectedTool && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full flex flex-col md:flex-row overflow-hidden relative">
            <div className="md:w-1/2 bg-[#E0F3FF] flex items-center justify-center p-6">
              <Image
                src={selectedTool.preview}
                alt={`Preview of ${selectedTool.name}`}
                width={300}
                height={300}
                className="rounded-xl object-cover"
              />
            </div>
            <div className="md:w-1/2 p-6 space-y-4 relative">
              <button
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl"
                onClick={() => setSelectedTool(null)}
              >
                ✕
              </button>
              <h3 className="text-xl font-bold text-gray-900">
                {selectedTool.name}
                {selectedTool.isNew && (
                  <span className="ml-2 bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full">
                    New
                  </span>
                )}
              </h3>
              <p className="text-sm text-gray-600">
                {selectedTool.description}
              </p>
              <div className="mt-4 space-y-2">
                <h4 className="text-sm font-semibold text-gray-800">
                  Features & Access
                </h4>
                <ul className="text-sm text-gray-600 list-disc list-inside">
                  <li>Use directly in our AI workspace</li>
                  <li>Secure, real-time AI integration</li>
                  <li>No setup or configuration required</li>
                  <li>{selectedTool.generationType} generation capabilities</li>
                </ul>
              </div>
              <div className="pt-4">
                <button
                  className="bg-purple-600 text-white px-5 py-2 rounded-md hover:bg-purple-700 transition"
                  onClick={() =>
                    alert(`Launching ${selectedTool.name}...`)
                  }
                >
                  Use Tool
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}