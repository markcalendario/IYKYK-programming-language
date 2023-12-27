export default async function fetchAPI(url, config) {
  const response = await fetch(process.env.NEXT_PUBLIC_API_URL + url, config);
}
