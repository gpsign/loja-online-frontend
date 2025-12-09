import PrivateRoute from "../PrivateRouter";

export default function Page({ children }: React.PropsWithChildren) {
  return (
    <PrivateRoute>
      <div className="container mx-auto px-4 py-8 md:py-12 min-h-[70vh]">
        {children}
      </div>
    </PrivateRoute>
  );
}
