import classNames from "classnames";
import Footer from "../Footer";
import Header from "../Header";

interface LayoutProps {
  children: React.ReactNode;
  className: string;
  displayFooter?: boolean;
}

export default function Layout({ children, className, displayFooter = true }: LayoutProps) {
  return (
    <main className={classNames("min-h-screen flex flex-col",className)}>
      <Header />
      {children}
      {displayFooter && <Footer />}
    </main>
  )
} 