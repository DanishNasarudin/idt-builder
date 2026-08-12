import { MenuList, menuList } from "@/lib/menu";

type PublicNavbarTreeItem = {
  id: string;
  label: string;
  href: string;
  order: number;
  visible: boolean;
  parentId: string | null;
  children: PublicNavbarTreeItem[];
};

type PublicNavbarResponse = {
  tree: PublicNavbarTreeItem[];
};

const publicNavbarUrl =
  process.env.PUBLIC_NAVBAR_URL ??
  "https://internal.idealtech.com.my/api/public-navbar";

function isPublicNavbarTreeItem(value: unknown): value is PublicNavbarTreeItem {
  if (!value || typeof value !== "object") return false;

  const item = value as Record<string, unknown>;

  return (
    typeof item.id === "string" &&
    typeof item.label === "string" &&
    typeof item.href === "string" &&
    typeof item.order === "number" &&
    typeof item.visible === "boolean" &&
    (typeof item.parentId === "string" || item.parentId === null) &&
    Array.isArray(item.children) &&
    item.children.every(isPublicNavbarTreeItem)
  );
}

function isPublicNavbarResponse(value: unknown): value is PublicNavbarResponse {
  if (!value || typeof value !== "object") return false;

  const response = value as Record<string, unknown>;

  return (
    Array.isArray(response.tree) &&
    response.tree.every(isPublicNavbarTreeItem)
  );
}

function toMenuItem(item: PublicNavbarTreeItem): MenuList {
  const visibleChildren = item.children.filter((child) => child.visible);

  return {
    title: item.label,
    href: item.href,
    target: true,
    dropdown:
      visibleChildren.length > 0
        ? visibleChildren.map((child) => ({
            title: child.label,
            href: child.href,
            target: true,
          }))
        : undefined,
  };
}

export async function getNavbarMenu(): Promise<MenuList[]> {
  if (!process.env.CLERK_SECRET_KEY) return menuList;

  try {
    const response = await fetch(publicNavbarUrl, {
      headers: {
        Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
      },
      cache: "no-store",
    });

    if (!response.ok) return menuList;

    const data: unknown = await response.json();

    if (!isPublicNavbarResponse(data)) return menuList;

    const remoteMenu = data.tree
      .filter((item) => item.visible)
      .map(toMenuItem);

    return remoteMenu.length > 0 ? remoteMenu : menuList;
  } catch {
    return menuList;
  }
}
