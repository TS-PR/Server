import puppeteer from "puppeteer";
import jsdom from "jsdom";
import fetch from "node-fetch";
import * as cheerio from "cheerio";

const { JSDOM } = jsdom;

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
    section: "세계",
  },
  {
    id: 105,
    section: "정치",
  },
];

const crawlMainLink = async () => {
  const linkList = [];
  const browser = await puppeteer.launch();
  const promises = sectionId.map(async (el, idx) => {
    const page = await browser.newPage();
    await page.goto(
      `https://news.naver.com/main/main.naver?mode=LSD&mid=shm&sid1=${el.id}`
    );

    const dom = await page.evaluate(() =>
      new XMLSerializer().serializeToString(document)
    );
    const { document } = new JSDOM(dom).window;

    const links = [];
    const elements = document.querySelectorAll(".cluster_thumb_inner > a");

    elements.forEach((el) => {
      const link = el.href;
      links.push(link);
    });
    linkList.push({ section: el.section, links });
    await page.close();
  });
  fetch("https://n.news.naver.com/mnews/article/055/0001052066?sid=102");
  await Promise.all(promises);
  await browser.close();
  return linkList;
};

// const crawlText = async (links) => {
//   const browser = await puppeteer.launch();
//   const data = [];

//   const promises = links.map(async (el, idx) => {
//     const textData = [];
//     const pages = await Promise.all(
//       el.links.map(async (el) => {
//         const page = await browser.newPage();
//         await page.goto(el);
//         return page;
//       })
//     );

//     const dataPromises = pages.map(async (page) => {
//       try {
//         const title = await page.$eval(
//           ".media_end_head_title span",
//           (el) => el.innerText
//         );
//         const $ = cheerio.load(page);

//         const text = $("#dic_area");
//         console.log(text);
//         textData.push({ title, text });
//         await page.close();
//       } catch (err) {
//         console.log(err);
//       }
//     });

//     await Promise.all(dataPromises);
//     data.push({ section: el.section, textData });
//   });

//   await Promise.all(promises);
//   await browser.close();
//   return data;
// };

const crawlText = async (links) => {
  const data = [];
  const promises = links.map(async (el) => {
    const textData = [];
    await Promise.all(
      el.links.map(async (el) => {
        await fetch(`${el}`)
          .then((res) => res.text())
          .then((html) => {
            const $ = cheerio.load(html);
            const text = $("#dic_area")
              .text()
              .replace(/[\t\n]/g, "");
            textData.push(text);
          })
          .catch((err) => console.log("hi"));
      })
    );
    data.push({ section: el.section, textData });
  });

  await Promise.all(promises);
  return data;
};

const crawler = async () => {
  const LinkData = await crawlMainLink();
  const realData = await crawlText(LinkData);
  console.log(realData);
};

crawler();

export default crawler;
