export const settingsMenuConfig = {
  triggerIcon: "lucide:sliders-horizontal",
  sections: [
    {
      control: "themeMode",
      title: "模式",
      ariaLabel: "模式",
      options: [
        { value: "light", label: "亮色", ariaLabel: "亮色模式", icon: "lucide:sun" },
        { value: "dark", label: "暗色", ariaLabel: "暗色模式", icon: "lucide:moon" },
        { value: "system", label: "系统", ariaLabel: "跟随系统", icon: "lucide:monitor" },
      ],
    },
    {
      type: "accent",
      className: "theme-accent",
      title: "主题色",
      ariaLabel: "主题色",
      valueId: "theme-accent-value",
      inputId: "theme-accent-range",
      defaultValue: 47,
      min: 0,
      max: 360,
      step: 1,
      resetLabel: "恢复默认",
      resetAriaLabel: "恢复默认主题色",
      resetIcon: "lucide:rotate-ccw",
    },
    {
      control: "wallpaperMode",
      className: "wallpaper-section",
      title: "全局透明",
      ariaLabel: "全局透明",
      options: [
        { value: "solid", label: "关闭", ariaLabel: "纯色背景", swatch: "solid" },
        { value: "global-transparent", label: "开启", ariaLabel: "全局透明", swatch: "global-transparent" },
      ],
    },
    {
      control: "backgroundFixed",
      className: "background-fixed-section",
      title: "背景固定",
      ariaLabel: "背景固定",
      options: [
        { value: "false", label: "关闭", ariaLabel: "背景随页面滚动", swatch: "scroll" },
        { value: "true", label: "开启", ariaLabel: "背景固定不动", swatch: "fixed" },
      ],
    },
    {
      control: "postListLayout",
      className: "list-layout-section",
      title: "文章列表",
      ariaLabel: "文章列表展示",
      options: [
        { value: "grid", label: "网格", ariaLabel: "网格展示" },
        { value: "list", label: "列表", ariaLabel: "列表展示" },
      ],
    },
  ],
};
