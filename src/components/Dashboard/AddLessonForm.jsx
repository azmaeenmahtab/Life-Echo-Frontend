"use client";

import React, { useState } from "react";
import {
  Input,
  Select,
  Label,
  ListBox,
  Tooltip,
  Button,
  Card,
} from "@heroui/react";
import {
  Bold,
  Italic,
  List,
  Quote,
  UploadCloud,
  Lock,
  CheckCircle2,
  Circle,
  ChevronDown, // Added chevron for smooth rotational animation
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

const categories = [
  { key: "personal-growth", label: "Personal Growth" },
  { key: "career", label: "Career" },
  { key: "relationships", label: "Relationships" },
  { key: "mindset", label: "Mindset" },
  { key: "mistakes-learned", label: "Mistakes Learned" },
];

const emotionalTones = [
  { key: "motivational", label: "Motivational" },
  { key: "sad", label: "Sad" },
  { key: "realization", label: "Realization" },
  { key: "gratitude", label: "Gratitude" },
];

export default function AddLessonPage() {
  const [isPremiumUser] = useState(false); // Set to true to unlock premium field

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(new Set(["personal-growth"]));
  const [emotionalTone, setEmotionalTone] = useState(new Set(["motivational"]));
  const [story, setStory] = useState("");
  const [accessLevel, setAccessLevel] = useState("free");
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      toast.success(`Selected image: ${file.name}`);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title.trim() || !story.trim()) {
      toast.error("Please fill out the Lesson Title and Story insights!");
      return;
    }

    const payload = {
      title,
      category: Array.from(category)[0],
      emotionalTone: Array.from(emotionalTone)[0],
      story,
      imageFile: selectedFile ? selectedFile.name : null,
      accessLevel: isPremiumUser ? accessLevel : "free",
    };

    console.log("🚀 Prepared Payload for API submission:", payload);
    toast.success("Seed planted successfully! Your lesson was stored.");

    setTitle("");
    setStory("");
    setSelectedFile(null);
  };

  return (
    <div className="min-h-screen bg-[#F5F2EB] py-12 px-4 sm:px-6 lg:px-8 flex justify-center">
      <Toaster position="top-right" reverseOrder={false} />

      <div className="w-full max-w-3xl">
        <header className="mb-8 pl-1">
          <h1 className="text-3xl font-serif font-bold text-[#1E2E24] mb-2">
            Plant a New Seed
          </h1>
          <p className="text-base font-sans text-[#556359]">
            Share your story, wisdom, or a realization that could help others
            grow.
          </p>
        </header>

        <Card
          shadow="none"
          className="bg-[#FAF8F3] border border-[#EBE7D9] rounded-[32px] p-6 md:p-10"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Lesson Title */}
            <div>
              <label className="block text-sm font-sans font-bold text-[#707E74] uppercase tracking-wide mb-2">
                Lesson Title
              </label>
              <Input
                type="text"
                placeholder="e.g., Finding Balance in Chaos"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                // classNames={{
                //   input:
                //     "text-base font-sans placeholder-[#A0AEA4] text-[#1E2E24] bg-transparent outline-none w-full",
                //   inputWrapper: [
                //     "bg-[#F2EFE6]",
                //     "hover:bg-[#EBE7D9]",
                //     "focus-within:!bg-[#F2EFE6]",
                //     "focus-within:border-[#467856]",
                //     "border border-[#E3DFD3]",
                //     "rounded-xl",
                //     "h-12",
                //     "px-4",
                //     "shadow-none",
                //     "transition-all duration-200",
                //     "flex items-center",
                //   ].join(" "),
                // }}
                className="w-full px-3 py-2 border border-[#E3DFD3] bg-[#F2EFE6] hover:bg-[#EBE7D9] rounded-xl text-base font-sans placeholder-[#A0AEA4]"
              />
            </div>

            {/* Selection Dropdown Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Category Dropdown */}
              <div className="relative">
                <Select
                  className="w-full"
                  placeholder="Select a category"
                  selectedKeys={category}
                  onChange={setCategory}
                >
                  <Label className="block text-sm font-sans font-bold text-[#707E74] uppercase tracking-wide mb-2">
                    Category
                  </Label>
                  <Select.Trigger className="w-full flex justify-between items-center bg-[#F2EFE6] hover:bg-[#EBE7D9] data-[pressed=true]:scale-[0.98] border border-[#E3DFD3] rounded-xl h-12 text-base font-sans text-[#1E2E24] font-medium px-4 transition-all duration-200 focus:outline-none group">
                    <Select.Value />
                    <ChevronDown
                      size={18}
                      className="text-[#707E74] transition-transform duration-200 group-data-[open=true]:rotate-180"
                    />
                  </Select.Trigger>

                  <Select.Popover className="z-50 min-w-[200px] mt-1 bg-[#FAF8F3] border border-[#EBE7D9] rounded-xl shadow-xl animate-in fade-in slide-in-from-top-2 duration-150">
                    <ListBox className="p-1 outline-none">
                      {categories.map((cat) => (
                        <ListBox.Item
                          key={cat.key}
                          id={cat.key}
                          textValue={cat.label}
                          className="px-3 py-2.5 rounded-lg text-sm font-sans font-medium text-[#1E2E24] data-[hover=true]:bg-[#E2F0E7] data-[hover=true]:text-[#2D6A4F] data-[selected=true]:bg-[#467856] data-[selected=true]:text-white transition-colors cursor-pointer outline-none"
                        >
                          {cat.label}
                        </ListBox.Item>
                      ))}
                    </ListBox>
                  </Select.Popover>
                </Select>
              </div>

              {/* Emotional Tone Dropdown */}
              <div className="relative">
                <Select
                  className="w-full"
                  placeholder="Select a tone"
                  selectedKeys={emotionalTone}
                  onChange={setEmotionalTone}
                >
                  <Label className="block text-sm font-sans font-bold text-[#707E74] uppercase tracking-wide mb-2">
                    Emotional Tone
                  </Label>
                  <Select.Trigger className="w-full flex justify-between items-center bg-[#F2EFE6] hover:bg-[#EBE7D9] data-[pressed=true]:scale-[0.98] border border-[#E3DFD3] rounded-xl h-12 text-base font-sans text-[#1E2E24] font-medium px-4 transition-all duration-200 focus:outline-none group">
                    <Select.Value />
                    <ChevronDown
                      size={18}
                      className="text-[#707E74] transition-transform duration-200 group-data-[open=true]:rotate-180"
                    />
                  </Select.Trigger>

                  <Select.Popover className="z-50 min-w-[200px] mt-1 bg-[#FAF8F3] border border-[#EBE7D9] rounded-xl shadow-xl animate-in fade-in slide-in-from-top-2 duration-150">
                    <ListBox className="p-1 outline-none">
                      {emotionalTones.map((tone) => (
                        <ListBox.Item
                          key={tone.key}
                          id={tone.key}
                          textValue={tone.label}
                          className="px-3 py-2.5 rounded-lg text-sm font-sans font-medium text-[#1E2E24] data-[hover=true]:bg-[#E2F0E7] data-[hover=true]:text-[#2D6A4F] data-[selected=true]:bg-[#467856] data-[selected=true]:text-white transition-colors cursor-pointer outline-none"
                        >
                          {tone.label}
                        </ListBox.Item>
                      ))}
                    </ListBox>
                  </Select.Popover>
                </Select>
              </div>
            </div>

            {/* Story Editor Area */}
            <div>
              <label className="block text-sm font-sans font-bold text-[#707E74] uppercase tracking-wide mb-2">
                Full Story / Insight
              </label>
              <div className="border border-[#E3DFD3] rounded-2xl bg-[#F2EFE6] overflow-hidden focus-within:border-[#467856] focus-within:bg-[#FAF8F3] transition-all duration-200">
                <div className="flex items-center gap-4 px-4 py-3 bg-[#EBE7D9]/50 border-b border-[#E3DFD3] text-[#707E74]">
                  <button
                    type="button"
                    className="hover:text-[#1E2E24] transition-colors"
                  >
                    <Bold size={16} />
                  </button>
                  <button
                    type="button"
                    className="hover:text-[#1E2E24] transition-colors"
                  >
                    <Italic size={16} />
                  </button>
                  <button
                    type="button"
                    className="hover:text-[#1E2E24] transition-colors"
                  >
                    <List size={16} />
                  </button>
                  <button
                    type="button"
                    className="hover:text-[#1E2E24] transition-colors"
                  >
                    <Quote size={16} />
                  </button>
                </div>
                <textarea
                  rows={6}
                  placeholder="Once upon a time, I realized that..."
                  value={story}
                  onChange={(e) => setStory(e.target.value)}
                  className="w-full bg-transparent p-4 text-base font-sans text-[#1E2E24] placeholder-[#A0AEA4] focus:outline-none resize-none leading-relaxed"
                />
              </div>
            </div>

            {/* Upload Area & Access Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div>
                <label className="block text-sm font-sans font-bold text-[#707E74] uppercase tracking-wide mb-2">
                  Lesson Image (Optional)
                </label>
                <label className="flex flex-col items-center justify-center border-2 border-dashed border-[#E3DFD3] rounded-2xl p-6 bg-[#F2EFE6]/40 hover:bg-[#F2EFE6]/80 active:scale-[0.99] cursor-pointer transition-all duration-200 group h-[126px]">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  <UploadCloud
                    size={26}
                    className="text-[#A0AEA4] group-hover:text-[#467856] group-hover:-translate-y-0.5 transition-all duration-200 mb-1.5"
                  />
                  <span className="text-sm font-sans font-semibold text-[#1E2E24]">
                    Click to upload or drag & drop
                  </span>
                  <span className="text-[10px] text-[#707E74] mt-0.5">
                    SVG, PNG, JPG or GIF (max. 5MB)
                  </span>
                </label>
              </div>

              <div>
                <label className="block text-sm font-sans font-bold text-[#707E74] uppercase tracking-wide mb-2">
                  Access Level
                </label>
                <div className="space-y-2.5">
                  <div
                    onClick={() => setAccessLevel("free")}
                    className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer active:scale-[0.99] transition-all duration-200 ${
                      accessLevel === "free"
                        ? "bg-white border-[#467856] shadow-md ring-1 ring-[#467856]/20"
                        : "bg-[#F2EFE6]/50 border-[#E3DFD3] hover:bg-[#F2EFE6]"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {accessLevel === "free" ? (
                        <CheckCircle2 size={18} className="text-[#467856]" />
                      ) : (
                        <Circle size={18} className="text-[#A0AEA4]" />
                      )}
                      <div>
                        <p className="text-sm font-sans font-bold text-[#1E2E24]">
                          Free
                        </p>
                        <p className="text-xs text-[#707E74]">
                          Available to everyone
                        </p>
                      </div>
                    </div>
                  </div>

                  <Tooltip
                    isDisabled={isPremiumUser}
                    content="Upgrade to Premium to create paid lessons."
                    placement="top"
                    className="bg-[#1E2E24] text-white rounded-lg px-3 py-1.5 text-xs font-sans font-medium shadow-xl"
                  >
                    <div
                      onClick={() => isPremiumUser && setAccessLevel("premium")}
                      className={`flex items-center justify-between p-3.5 rounded-xl border transition-all duration-200 ${
                        !isPremiumUser
                          ? "bg-[#EBE7D9]/40 border-[#EBE7D9] opacity-60 cursor-not-allowed"
                          : accessLevel === "premium"
                            ? "bg-white border-[#467856] shadow-md ring-1 ring-[#467856]/20 cursor-pointer active:scale-[0.99]"
                            : "bg-[#F2EFE6]/50 border-[#E3DFD3] hover:bg-[#F2EFE6] cursor-pointer active:scale-[0.99]"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {accessLevel === "premium" && isPremiumUser ? (
                          <CheckCircle2 size={18} className="text-[#467856]" />
                        ) : (
                          <Circle size={18} className="text-[#A0AEA4]" />
                        )}
                        <div>
                          <div className="flex items-center gap-1.5">
                            <p className="text-sm font-sans font-bold text-[#1E2E24]">
                              Premium
                            </p>
                            {!isPremiumUser && (
                              <Lock size={12} className="text-[#707E74]" />
                            )}
                          </div>
                          <p className="text-xs text-[#707E74]">
                            Subscription required
                          </p>
                        </div>
                      </div>
                    </div>
                  </Tooltip>
                </div>
              </div>
            </div>

            {/* Submit Action */}
            <div className="pt-4 flex justify-end">
              <Button
                type="submit"
                className="bg-[#467856] hover:bg-[#386145] data-[pressed=true]:scale-[0.97] text-white font-sans font-semibold px-8 py-6 rounded-xl shadow-md transition-all duration-200 text-base"
              >
                Plant Seed & Save
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
