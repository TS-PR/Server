import fetch from "node-fetch";
import * as cheerio from "cheerio";
import { v4 as uuidv4 } from "uuid";

const sectionId = [
  {
    id: 100,
    section: "정치",
  },
  {
    id: 101,
    section: "경제",
  },
  {
    id: 102,
    section: "사회",
  },
  {
    id: 103,
    section: "생활/문화",
  },
  {
    id: 104,
    section: "IT/과학",
  },
  {
    id: 105,
    section: "세계",
  },
];

const crawlMainLink = async () => {
  const linkList = [];

  const promises = sectionId.map(async (el) => {
    const url = `https://news.naver.com/main/main.naver?mode=LSD&mid=shm&sid1=${el.id}`;
    await fetch(url)
      .then((res) => res.text()) // 응답을 문자열로 변환
      .then((html) => {
        const $ = cheerio.load(html);
        const links = [];
        $(".sh_text > a").each((_, el) => {
          const link = $(el).attr("href");
          links.push(link);
        });
        linkList.push({ section: el.section, links });
      });
  });

  await Promise.all(promises);
  return linkList;
};

const crawlText = async (links) => {
  const data = [];
  const promises = links.map(async (item) => {
    await Promise.all(
      item.links.map(async (el) => {
        await fetch(`${el}`)
          .then((res) => res.text())
          .then((html) => {
            const $ = cheerio.load(html);
            const body = $("#dic_area")
              .text()
              .replace(/[\t\n]/g, "");
            const title = $(".media_end_head_headline").text();
            const date = $("._ARTICLE_DATE_TIME").text();
            const thumbnail = $("#img1")["0"]?.attribs["data-src"];
            const id = uuidv4();
            const eachPost = {
              title,
              body,
              date,
              href: el,
              thumbnail,
              id,
              section: item.section,
            };
            data.push(eachPost);
          })
          .catch((err) => console.log(err));
      })
    );
  });

  await Promise.all(promises);
  return data;
};

const crawler = async () => {
  const LinkData = await crawlMainLink();
  const realData = await crawlText(LinkData);

  return realData;
};

export default crawler;
