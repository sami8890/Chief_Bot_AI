
export function Footer() {
  return (
    <footer className="py-6 mt-12 px-6 border-t">
      <div className="container mx-auto text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} ChefBot. All rights reserved.</p>
      </div>
    </footer>
  );
}
