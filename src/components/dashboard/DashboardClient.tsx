"use client";

import { useEffect, useState } from "react";
import { Button, Column, Row, Spinner, useToast } from "@once-ui-system/core";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import type { Auth, User } from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { getFirebaseAuth } from "@/lib/firebase/client";
import {
  createPortfolioGalleryItem,
  createPortfolioPost,
  createPortfolioProject,
  deletePortfolioGalleryItem,
  deletePortfolioPost,
  deletePortfolioProject,
  getPortfolioGallery,
  getPortfolioPosts,
  getPortfolioProjects,
  getPortfolioSettings,
  savePortfolioSettings,
  updatePortfolioGalleryItem,
  updatePortfolioPost,
  updatePortfolioProject,
} from "@/lib/firebase/portfolio";
import { defaultPortfolioSettings } from "@/lib/portfolio-defaults";
import { DashboardLoginCard } from "./DashboardLoginCard";
import { DashboardStatusCard } from "./DashboardStatusCard";
import { ExperienceSection } from "./ExperienceSection";
import { GalleryEditorSection } from "./GalleryEditorSection";
import { PostsEditorSection } from "./PostsEditorSection";
import { ProfileSettingsSection } from "./ProfileSettingsSection";
import { ProjectsEditorSection } from "./ProjectsEditorSection";
import { SkillsSection } from "./SkillsSection";
import { SiteSettingsSection } from "./SiteSettingsSection";
import { SocialLinksSection } from "./SocialLinksSection";
import { StudiesSection } from "./StudiesSection";
import type {
  PortfolioExperience,
  PortfolioGalleryItem,
  PortfolioPost,
  PortfolioProject,
  PortfolioSkill,
  PortfolioSocialLink,
  PortfolioSettings,
  PortfolioStudy,
} from "@/types";

const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;

const emptyProject: PortfolioProject = {
  slug: "",
  title: "",
  summary: "",
  content: "",
  publishedAt: new Date().toISOString().slice(0, 10),
  image: "",
  images: [],
  tag: "",
  link: "",
  featured: false,
  team: [],
};

const emptyPost: PortfolioPost = {
  slug: "",
  title: "",
  subtitle: "",
  summary: "",
  content: "",
  publishedAt: new Date().toISOString().slice(0, 10),
  image: "",
  tag: "",
};

const emptyGalleryItem: PortfolioGalleryItem = {
  src: "",
  alt: "",
  orientation: "horizontal",
  order: 0,
};

const emptySocialLink: PortfolioSocialLink = {
  id: "",
  name: "",
  icon: "github",
  link: "",
  essential: true,
  order: 0,
};

const emptyExperience: PortfolioExperience = {
  company: "",
  timeframe: "",
  role: "",
  achievements: [],
  images: [],
};

const emptyStudy: PortfolioStudy = {
  name: "",
  description: "",
};

const emptySkill: PortfolioSkill = {
  title: "",
  description: "",
  tags: [],
  images: [],
};

function mapAuthError(error: unknown) {
  if (!(error instanceof FirebaseError)) {
    return "Login gagal. Coba lagi sebentar.";
  }

  switch (error.code) {
    case "auth/invalid-credential":
    case "auth/user-not-found":
    case "auth/wrong-password":
      return "Email atau password tidak cocok.";
    case "auth/invalid-email":
      return "Format email belum valid.";
    case "auth/too-many-requests":
      return "Terlalu banyak percobaan login. Coba lagi beberapa saat.";
    default:
      return "Firebase Auth belum siap atau terjadi kesalahan login.";
  }
}

function tagsToLines(tags: PortfolioSkill["tags"]) {
  return (
    tags
      ?.map((tag) => (tag.icon ? `${tag.name}:${tag.icon}` : tag.name))
      .join("\n") ?? ""
  );
}

function linesToTags(value: string): NonNullable<PortfolioSkill["tags"]> {
  return value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean)
    .map((item) => {
      const [name, icon] = item.split(":").map((valuePart) => valuePart.trim());
      return {
        name,
        icon: icon || undefined,
      };
    });
}

export function DashboardClient() {
  const { addToast } = useToast();
  const [email, setEmail] = useState(adminEmail ?? "");
  const [password, setPassword] = useState("");
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [hasCustomClaim, setHasCustomClaim] = useState(false);
  const [authReady, setAuthReady] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const [loadingData, setLoadingData] = useState(false);
  const [settings, setSettings] = useState<PortfolioSettings>(defaultPortfolioSettings);
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [posts, setPosts] = useState<PortfolioPost[]>([]);
  const [galleryItems, setGalleryItems] = useState<PortfolioGalleryItem[]>([]);

  const [projectDraft, setProjectDraft] = useState<PortfolioProject>(emptyProject);
  const [postDraft, setPostDraft] = useState<PortfolioPost>(emptyPost);
  const [galleryDraft, setGalleryDraft] = useState<PortfolioGalleryItem>(emptyGalleryItem);
  const [socialDraft, setSocialDraft] = useState<PortfolioSocialLink>(emptySocialLink);
  const [experienceDraft, setExperienceDraft] = useState<PortfolioExperience>(emptyExperience);
  const [studyDraft, setStudyDraft] = useState<PortfolioStudy>(emptyStudy);
  const [skillDraft, setSkillDraft] = useState<PortfolioSkill>(emptySkill);
  const [activeTab, setActiveTab] = useState<
    "site" | "profile" | "social" | "experience" | "studies" | "skills" | "projects" | "posts" | "gallery"
  >("site");
  const [importingSeed, setImportingSeed] = useState(false);

  useEffect(() => {
    let auth: Auth;
    try {
      auth = getFirebaseAuth();
    } catch (authError) {
      setCurrentUser(null);
      setHasCustomClaim(false);
      setAuthReady(true);
      setError(
        authError instanceof Error
          ? authError.message
          : "Firebase belum terkonfigurasi dengan benar di environment.",
      );
      return () => undefined;
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        if (user) {
          const tokenResult = await user.getIdTokenResult(true);
          const userEmail = user.email?.toLowerCase();
          const hasAdminClaim = tokenResult.claims.admin === true;
          const hasAdminEmail = Boolean(adminEmail) && userEmail === adminEmail?.toLowerCase();

          if (!hasAdminClaim && !hasAdminEmail) {
            await signOut(auth);
            setCurrentUser(null);
            setHasCustomClaim(false);
            setError("Akun ini bukan admin dashboard.");
            setAuthReady(true);
            return;
          }

          setHasCustomClaim(hasAdminClaim);
        } else {
          setHasCustomClaim(false);
        }

        setCurrentUser(user);
        setAuthReady(true);
      } catch (authStateError) {
        setCurrentUser(null);
        setHasCustomClaim(false);
        setAuthReady(true);
        setError(
          authStateError instanceof Error
            ? authStateError.message
            : "Gagal memverifikasi sesi admin Firebase.",
        );
      }
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!currentUser) {
      return;
    }

    const loadDashboardData = async () => {
      setLoadingData(true);
      try {
        const [portfolioSettings, portfolioProjects, portfolioPosts, portfolioGallery] =
          await Promise.all([
            getPortfolioSettings(),
            getPortfolioProjects(),
            getPortfolioPosts(),
            getPortfolioGallery(),
          ]);

        setSettings(portfolioSettings ?? defaultPortfolioSettings);
        setProjects(
          [...portfolioProjects].sort((left, right) =>
            right.publishedAt.localeCompare(left.publishedAt),
          ),
        );
        setPosts(
          [...portfolioPosts].sort((left, right) => right.publishedAt.localeCompare(left.publishedAt)),
        );
        setGalleryItems(
          [...portfolioGallery].sort((left, right) => (left.order ?? 0) - (right.order ?? 0)),
        );
      } catch (loadError) {
        addToast({
          variant: "danger",
          message: loadError instanceof Error ? loadError.message : "Gagal memuat data dashboard.",
        });
      } finally {
        setLoadingData(false);
      }
    };

    void loadDashboardData();
  }, [currentUser, addToast]);

  const handleLogin = async () => {
    setSubmitting(true);
    setError(undefined);

    try {
      if (!adminEmail) {
        throw new Error("NEXT_PUBLIC_ADMIN_EMAIL is not configured.");
      }

      if (email.trim().toLowerCase() !== adminEmail.toLowerCase()) {
        setError("Gunakan email admin yang sudah kamu set di environment.");
        setSubmitting(false);
        return;
      }

      await signInWithEmailAndPassword(getFirebaseAuth(), email.trim(), password);
      addToast({
        variant: "success",
        message: "Login admin berhasil.",
      });
    } catch (loginError) {
      setError(
        loginError instanceof Error && loginError.message === "NEXT_PUBLIC_ADMIN_EMAIL is not configured."
          ? "Set NEXT_PUBLIC_ADMIN_EMAIL dulu di .env.local."
          : mapAuthError(loginError),
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = async () => {
    await signOut(getFirebaseAuth());
    setPassword("");
    setHasCustomClaim(false);
    addToast({
      variant: "success",
      message: "Kamu sudah logout dari dashboard.",
    });
  };

  const handleSaveSettings = async () => {
    setSubmitting(true);
    try {
      await savePortfolioSettings(settings);
      addToast({
        variant: "success",
        message: "Settings portfolio berhasil disimpan.",
      });
    } catch (saveError) {
      addToast({
        variant: "danger",
        message: saveError instanceof Error ? saveError.message : "Gagal menyimpan settings.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleSaveSocialLink = () => {
    const id = socialDraft.id || socialDraft.name.toLowerCase().replace(/\s+/g, "-");
    const nextLinks = [...settings.socialLinks];
    const existingIndex = nextLinks.findIndex((item) => item.id === id);
    const socialLink = { ...socialDraft, id };

    if (existingIndex >= 0) {
      nextLinks[existingIndex] = socialLink;
    } else {
      nextLinks.push(socialLink);
    }

    setSettings((current) => ({
      ...current,
      socialLinks: nextLinks.sort((left, right) => (left.order ?? 0) - (right.order ?? 0)),
    }));
    setSocialDraft(emptySocialLink);
  };

  const handleDeleteSocialLink = (id: string) => {
    setSettings((current) => ({
      ...current,
      socialLinks: current.socialLinks.filter((item) => item.id !== id),
    }));
    if (socialDraft.id === id) {
      setSocialDraft(emptySocialLink);
    }
  };

  const handleSaveExperience = () => {
    const nextItems = [...settings.experiences];
    const existingIndex = nextItems.findIndex(
      (item) => item.company === experienceDraft.company && item.role === experienceDraft.role,
    );

    if (existingIndex >= 0) {
      nextItems[existingIndex] = experienceDraft;
    } else {
      nextItems.push(experienceDraft);
    }

    setSettings((current) => ({ ...current, experiences: nextItems }));
    setExperienceDraft(emptyExperience);
  };

  const handleDeleteExperience = (company: string, role: string) => {
    setSettings((current) => ({
      ...current,
      experiences: current.experiences.filter(
        (item) => !(item.company === company && item.role === role),
      ),
    }));
  };

  const handleSaveStudy = () => {
    const nextItems = [...settings.studies];
    const existingIndex = nextItems.findIndex((item) => item.name === studyDraft.name);

    if (existingIndex >= 0) {
      nextItems[existingIndex] = studyDraft;
    } else {
      nextItems.push(studyDraft);
    }

    setSettings((current) => ({ ...current, studies: nextItems }));
    setStudyDraft(emptyStudy);
  };

  const handleDeleteStudy = (name: string) => {
    setSettings((current) => ({
      ...current,
      studies: current.studies.filter((item) => item.name !== name),
    }));
  };

  const handleSaveSkill = () => {
    const nextItems = [...settings.skills];
    const existingIndex = nextItems.findIndex((item) => item.title === skillDraft.title);

    if (existingIndex >= 0) {
      nextItems[existingIndex] = skillDraft;
    } else {
      nextItems.push(skillDraft);
    }

    setSettings((current) => ({ ...current, skills: nextItems }));
    setSkillDraft(emptySkill);
  };

  const handleDeleteSkill = (title: string) => {
    setSettings((current) => ({
      ...current,
      skills: current.skills.filter((item) => item.title !== title),
    }));
  };

  const handleSaveProject = async () => {
    setSubmitting(true);
    try {
      if (projectDraft.id) {
        await updatePortfolioProject(projectDraft);
      } else {
        await createPortfolioProject(projectDraft);
      }

      const refreshedProjects = await getPortfolioProjects();
      setProjects(
        [...refreshedProjects].sort((left, right) => right.publishedAt.localeCompare(left.publishedAt)),
      );
      setProjectDraft(emptyProject);
      addToast({
        variant: "success",
        message: "Project berhasil disimpan.",
      });
    } catch (saveError) {
      addToast({
        variant: "danger",
        message: saveError instanceof Error ? saveError.message : "Gagal menyimpan project.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteProject = async (id?: string) => {
    if (!id) return;
    setSubmitting(true);
    try {
      await deletePortfolioProject(id);
      const refreshedProjects = await getPortfolioProjects();
      setProjects(
        [...refreshedProjects].sort((left, right) => right.publishedAt.localeCompare(left.publishedAt)),
      );
      if (projectDraft.id === id) {
        setProjectDraft(emptyProject);
      }
      addToast({
        variant: "success",
        message: "Project berhasil dihapus.",
      });
    } catch (deleteError) {
      addToast({
        variant: "danger",
        message: deleteError instanceof Error ? deleteError.message : "Gagal menghapus project.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleSavePost = async () => {
    setSubmitting(true);
    try {
      if (postDraft.id) {
        await updatePortfolioPost(postDraft);
      } else {
        await createPortfolioPost(postDraft);
      }

      const refreshedPosts = await getPortfolioPosts();
      setPosts([...refreshedPosts].sort((left, right) => right.publishedAt.localeCompare(left.publishedAt)));
      setPostDraft(emptyPost);
      addToast({
        variant: "success",
        message: "Blog post berhasil disimpan.",
      });
    } catch (saveError) {
      addToast({
        variant: "danger",
        message: saveError instanceof Error ? saveError.message : "Gagal menyimpan blog post.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeletePost = async (id?: string) => {
    if (!id) return;
    setSubmitting(true);
    try {
      await deletePortfolioPost(id);
      const refreshedPosts = await getPortfolioPosts();
      setPosts([...refreshedPosts].sort((left, right) => right.publishedAt.localeCompare(left.publishedAt)));
      if (postDraft.id === id) {
        setPostDraft(emptyPost);
      }
      addToast({
        variant: "success",
        message: "Blog post berhasil dihapus.",
      });
    } catch (deleteError) {
      addToast({
        variant: "danger",
        message: deleteError instanceof Error ? deleteError.message : "Gagal menghapus blog post.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleSaveGalleryItem = async () => {
    setSubmitting(true);
    try {
      if (galleryDraft.id) {
        await updatePortfolioGalleryItem(galleryDraft);
      } else {
        await createPortfolioGalleryItem(galleryDraft);
      }

      const refreshedGallery = await getPortfolioGallery();
      setGalleryItems([...refreshedGallery].sort((left, right) => (left.order ?? 0) - (right.order ?? 0)));
      setGalleryDraft(emptyGalleryItem);
      addToast({
        variant: "success",
        message: "Gallery item berhasil disimpan.",
      });
    } catch (saveError) {
      addToast({
        variant: "danger",
        message: saveError instanceof Error ? saveError.message : "Gagal menyimpan gallery item.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteGalleryItem = async (id?: string) => {
    if (!id) return;
    setSubmitting(true);
    try {
      await deletePortfolioGalleryItem(id);
      const refreshedGallery = await getPortfolioGallery();
      setGalleryItems([...refreshedGallery].sort((left, right) => (left.order ?? 0) - (right.order ?? 0)));
      if (galleryDraft.id === id) {
        setGalleryDraft(emptyGalleryItem);
      }
      addToast({
        variant: "success",
        message: "Gallery item berhasil dihapus.",
      });
    } catch (deleteError) {
      addToast({
        variant: "danger",
        message: deleteError instanceof Error ? deleteError.message : "Gagal menghapus gallery item.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleMoveGalleryItem = async (id: string | undefined, direction: "up" | "down") => {
    if (!id) return;

    const currentIndex = galleryItems.findIndex((item) => item.id === id);
    if (currentIndex === -1) return;

    const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= galleryItems.length) return;

    const nextItems = [...galleryItems];
    const [movedItem] = nextItems.splice(currentIndex, 1);
    nextItems.splice(targetIndex, 0, movedItem);

    const reorderedItems = nextItems.map((item, index) => ({
      ...item,
      order: index,
    }));

    setGalleryItems(reorderedItems);
    setSubmitting(true);

    try {
      await Promise.all(
        reorderedItems
          .filter((item) => item.id)
          .map((item) => updatePortfolioGalleryItem(item)),
      );
      addToast({
        variant: "success",
        message: "Urutan gallery berhasil diperbarui.",
      });
    } catch (reorderError) {
      addToast({
        variant: "danger",
        message: reorderError instanceof Error ? reorderError.message : "Gagal mengubah urutan gallery.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleReorderGalleryItems = async (from: number, to: number) => {
    if (from === to || from < 0 || to < 0 || from >= galleryItems.length || to >= galleryItems.length) {
      return;
    }

    const nextItems = [...galleryItems];
    const [movedItem] = nextItems.splice(from, 1);
    nextItems.splice(to, 0, movedItem);

    const reorderedItems = nextItems.map((item, index) => ({
      ...item,
      order: index,
    }));

    setGalleryItems(reorderedItems);
    setSubmitting(true);

    try {
      await Promise.all(
        reorderedItems.filter((item) => item.id).map((item) => updatePortfolioGalleryItem(item)),
      );
      addToast({
        variant: "success",
        message: "Urutan gallery berhasil diperbarui.",
      });
    } catch (reorderError) {
      addToast({
        variant: "danger",
        message: reorderError instanceof Error ? reorderError.message : "Gagal mengubah urutan gallery.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleImportSeed = async () => {
    setImportingSeed(true);

    try {
      const response = await fetch("/api/seed-content");
      if (!response.ok) {
        throw new Error("Gagal mengambil starter content.");
      }

      const payload = (await response.json()) as {
        settings: PortfolioSettings;
        projects: PortfolioProject[];
        posts: PortfolioPost[];
        gallery: PortfolioGalleryItem[];
      };

      await savePortfolioSettings(payload.settings);

      const existingProjects = await getPortfolioProjects();
      for (const project of payload.projects) {
        const existing = existingProjects.find((item) => item.slug === project.slug);
        if (existing?.id) {
          await updatePortfolioProject({ ...project, id: existing.id });
        } else {
          await createPortfolioProject(project);
        }
      }

      const existingPosts = await getPortfolioPosts();
      for (const post of payload.posts) {
        const existing = existingPosts.find((item) => item.slug === post.slug);
        if (existing?.id) {
          await updatePortfolioPost({ ...post, id: existing.id });
        } else {
          await createPortfolioPost(post);
        }
      }

      const existingGallery = await getPortfolioGallery();
      await Promise.all(existingGallery.map((item) => (item.id ? deletePortfolioGalleryItem(item.id) : Promise.resolve())));
      for (const item of payload.gallery) {
        await createPortfolioGalleryItem(item);
      }

      setSettings(payload.settings);
      setProjects(await getPortfolioProjects());
      setPosts(await getPortfolioPosts());
      setGalleryItems(await getPortfolioGallery());

      addToast({
        variant: "success",
        message: "Starter content berhasil diimport ke Firestore.",
      });
    } catch (seedError) {
      addToast({
        variant: "danger",
        message: seedError instanceof Error ? seedError.message : "Gagal import starter content.",
      });
    } finally {
      setImportingSeed(false);
    }
  };

  if (!authReady) {
    return (
      <Column fillWidth horizontal="center" paddingY="64">
        <Spinner />
      </Column>
    );
  }

  if (!currentUser) {
    return (
      <DashboardLoginCard
        email={email}
        password={password}
        error={error}
        submitting={submitting}
        onEmailChange={setEmail}
        onPasswordChange={setPassword}
        onLogin={() => {
          void handleLogin();
        }}
      />
    );
  }

  if (loadingData) {
    return (
      <Column fillWidth horizontal="center" paddingY="64">
        <Spinner />
      </Column>
    );
  }

  return (
    <Column fillWidth gap="32">
      <DashboardStatusCard
        email={currentUser.email ?? adminEmail ?? "admin"}
        hasCustomClaim={hasCustomClaim}
        importing={importingSeed}
        onImportSeed={() => {
          void handleImportSeed();
        }}
        onLogout={() => {
          void handleLogout();
        }}
      />

      <Row gap="8" wrap>
        {[
          ["site", "Site"],
          ["profile", "Profile"],
          ["social", "Social"],
          ["experience", "Experience"],
          ["studies", "Studies"],
          ["skills", "Skills"],
          ["projects", "Projects"],
          ["posts", "Posts"],
          ["gallery", "Gallery"],
        ].map(([value, label]) => (
          <Button
            key={value}
            variant={activeTab === value ? "primary" : "secondary"}
            size="s"
            onClick={() => setActiveTab(value as typeof activeTab)}
          >
            {label}
          </Button>
        ))}
      </Row>

      {activeTab === "site" && (
        <SiteSettingsSection
          settings={settings}
          submitting={submitting}
          onSettingsChange={(updater) => setSettings((current) => updater(current))}
          onSave={() => {
            void handleSaveSettings();
          }}
        />
      )}

      {activeTab === "profile" && (
        <ProfileSettingsSection
          settings={settings}
          submitting={submitting}
          onSettingsChange={(updater) => setSettings((current) => updater(current))}
          onSave={() => {
            void handleSaveSettings();
          }}
        />
      )}

      {activeTab === "social" && (
        <SocialLinksSection
          settings={settings}
          socialDraft={socialDraft}
          onDraftChange={(updater) => setSocialDraft((current) => updater(current))}
          onEdit={setSocialDraft}
          onDelete={handleDeleteSocialLink}
          onSaveDraft={handleSaveSocialLink}
          onReset={() => setSocialDraft(emptySocialLink)}
        />
      )}

      {activeTab === "experience" && (
        <ExperienceSection
          settings={settings}
          experienceDraft={experienceDraft}
          onDraftChange={(updater) => setExperienceDraft((current) => updater(current))}
          onEdit={setExperienceDraft}
          onDelete={handleDeleteExperience}
          onSaveDraft={handleSaveExperience}
          onReset={() => setExperienceDraft(emptyExperience)}
        />
      )}

      {activeTab === "studies" && (
        <StudiesSection
          settings={settings}
          studyDraft={studyDraft}
          onDraftChange={(updater) => setStudyDraft((current) => updater(current))}
          onEdit={setStudyDraft}
          onDelete={handleDeleteStudy}
          onSaveDraft={handleSaveStudy}
          onReset={() => setStudyDraft(emptyStudy)}
        />
      )}

      {activeTab === "skills" && (
        <SkillsSection
          settings={settings}
          skillDraft={skillDraft}
          tagsValue={tagsToLines(skillDraft.tags)}
          onDraftChange={(updater) => setSkillDraft((current) => updater(current))}
          onEdit={setSkillDraft}
          onDelete={handleDeleteSkill}
          onSaveDraft={handleSaveSkill}
          onReset={() => setSkillDraft(emptySkill)}
        />
      )}

      {activeTab === "projects" && (
        <ProjectsEditorSection
          projects={projects}
          projectDraft={projectDraft}
          submitting={submitting}
          onDraftChange={(updater) => setProjectDraft((current) => updater(current))}
          onEdit={setProjectDraft}
          onDelete={(id) => {
            void handleDeleteProject(id);
          }}
          onSave={() => {
            void handleSaveProject();
          }}
          onReset={() => setProjectDraft(emptyProject)}
        />
      )}

      {activeTab === "posts" && (
        <PostsEditorSection
          posts={posts}
          postDraft={postDraft}
          submitting={submitting}
          onDraftChange={(updater) => setPostDraft((current) => updater(current))}
          onEdit={setPostDraft}
          onDelete={(id) => {
            void handleDeletePost(id);
          }}
          onSave={() => {
            void handleSavePost();
          }}
          onReset={() => setPostDraft(emptyPost)}
        />
      )}

      {activeTab === "gallery" && (
        <GalleryEditorSection
          galleryItems={galleryItems}
          galleryDraft={galleryDraft}
          submitting={submitting}
          onDraftChange={(updater) => setGalleryDraft((current) => updater(current))}
          onEdit={setGalleryDraft}
          onDelete={(id) => {
            void handleDeleteGalleryItem(id);
          }}
          onMove={(id, direction) => {
            void handleMoveGalleryItem(id, direction);
          }}
          onReorder={(from, to) => {
            void handleReorderGalleryItems(from, to);
          }}
          onSave={() => {
            void handleSaveGalleryItem();
          }}
          onReset={() => setGalleryDraft(emptyGalleryItem)}
        />
      )}
    </Column>
  );
}
