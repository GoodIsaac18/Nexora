import Script from "next/script"

export function ThemeScript() {
  return (
    <Script id="theme-script" strategy="beforeInteractive">
      {`
(function() {
  try {
    var t = localStorage.getItem('theme');
    var m = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (t === 'dark' || (!t && m)) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
    if (t) document.documentElement.classList.add(t);
  } catch (e) {}
})();
      `}
    </Script>
  )
}
