import { useResolvedLanguage } from "@/hooks/queries";
import { useQuery } from "@tanstack/react-query";
import fiResources from "@/locales/resources/fi.json";
import svResources from "@/locales/resources/sv.json";
import { Resources, ResourcesSchema } from "@/types/data/resources";
import { ZodError } from "zod";

type Lang = "fi" | "sv";

const getOptions = (lang: Lang) => {
  return {
    filename: `resources_${lang}.json`,
    url: `https://raw.githubusercontent.com/TheGreenBureau/curia-resources/main/resources/${lang}.json`,
    local: lang === "sv" ? svResources : fiResources,
  };
};

const fetchResources = async (lang: Lang): Promise<Resources> => {
  const options = getOptions(lang);
  let resources = ResourcesSchema.parse(options.local);

  try {
    const data = await fetch(options.url);
    resources = ResourcesSchema.parse(await data.json());
    await window.api.saveDataFile({
      data: JSON.stringify(resources),
      filename: options.filename,
    });
  } catch (e) {
    if (e instanceof ZodError) {
      console.log(e.message);
    } else {
      console.log(e);
    }

    resources = ResourcesSchema.parse(
      await window.api.loadDataFile({
        filename: options.filename,
      })
    );
  } finally {
    return resources;
  }
};

export function useResources() {
  const lang = useResolvedLanguage();

  return useQuery({
    queryKey: ["resources", lang],
    queryFn: async () => fetchResources(lang),
    staleTime: Infinity,
  });
}
