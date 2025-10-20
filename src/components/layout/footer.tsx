
export function Footer() {
  return (
    <footer className="py-6 mt-12 px-6 border-t">
      <div className="container mx-auto text-center text-sm text-muted-foreground space-y-2">
        <p>This project is only for showcasing my skills. Please don’t make any actual purchases.</p>
        <p>&copy; {new Date().getFullYear()} ChefBot. All rights reserved.</p>
      </div>
    </footer>
  );
}
