import MyMap from "./components/MyMap";

function App() {
  const data = [
    {
      name: "CN",
      count: 2,
    },
    {
      name: null,
      count: 1,
    },
    {
      name: "MX",
      count: 1,
    },
    {
      name: "CA",
      count: 1,
    },
  ];
  return (
    <div>
      <MyMap className="mt-2" deviceData={[...data]} />
    </div>
  );
}

export default App;
