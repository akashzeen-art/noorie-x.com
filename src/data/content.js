// Chalchitra TV content catalog â€” thumbnails local, videos from Bunny CDN.

import { CHALCHITRA_THUMBS } from './thumbs-map.js';

const CONTENT_CDN = 'https://vz-012bcd01-e4e.b-cdn.net';
const LOCAL_THUMBS = 'img/thumbs/';

function videoUrl(video) {
  if (!video) return '';
  return video.videoUrl || '';
}

function thumbExists(relPath) {
  var exists = null;
  if (!exists) return true;
  var key = String(relPath || '').replace(/^img\//i, '');
  return !!(exists[key] || exists[key.toLowerCase()]);
}

function pickThumbPath(base, preferPortrait) {
  var portrait = 'img/portrait/' + base + '.jpg';
  var landscape = 'img/landscape/' + base + '.jpg';
  var order = preferPortrait ? [portrait, landscape] : [landscape, portrait];
  for (var i = 0; i < order.length; i++) {
    if (thumbExists(order[i])) return order[i];
  }
  if (thumbExists('img/landscape/BLACKHORIZON.jpg')) return 'img/landscape/BLACKHORIZON.jpg';
  if (thumbExists('img/landscape/RAAZBEYONDFEAR.jpg')) return 'img/landscape/RAAZBEYONDFEAR.jpg';
  return order[0];
}

function bunnyThumbFromVideo(video) {
  var url = (video && (video.videoUrl || video.url)) || '';
  var m = String(url).match(/\/\/(vz-[^/]+)\/([0-9a-f-]{36})\//i);
  if (!m) return '';
  return 'https://' + m[1] + '/' + m[2] + '/thumbnail.jpg';
}

function thumbUrl(video) {
  if (!video) return '';
  var t = video.thumb || '';
  // Absolute CDN URLs
  if (/^https?:/i.test(t)) return encodeURI(t);
  // Explicit local paths (newlandscape / newportrait / landscape / portrait)
  if (/^\/?img\//i.test(t)) {
    if (thumbExists(t)) return encodeURI(t);
    var explicitBase = t.replace(/^.*[\\/]/, '').replace(/\.(png|jpe?g|webp)$/i, '');
    var picked = pickThumbPath(explicitBase, /portrait/i.test(t));
    if (thumbExists(picked)) return encodeURI(picked);
    return bunnyThumbFromVideo(video) || encodeURI(t);
  }
  // When local thumb tree is missing, fall back to Bunny posters
  if (true) {
    var bunny = bunnyThumbFromVideo(video);
    if (bunny) return bunny;
  }
  var mapped = (video.id && CHALCHITRA_THUMBS[video.id]) || '';
  var name = (mapped || t).replace(/^.*[\\/]/, '');
  if (!name) return bunnyThumbFromVideo(video) || '';
  var base = name.replace(/\.(png|jpe?g|webp)$/i, '');
  // Legacy map names without punctuation → actual landscape/portrait filenames
  if (base === 'RAAZREVENGEMAFIAEP1') base = 'RAAZ,REVENGE&MAFIAEP1';
  if (base === 'RAAZREVENGEMAFIAEP2') base = 'RAAZ,REVENGE&MAFIAEP2';
  var path = pickThumbPath(base, video.aspect === 'portrait');
  if (thumbExists(path)) return encodeURI(path);
  return bunnyThumbFromVideo(video) || encodeURI(path);
}

export const CHALCHITRA = {
  "trendingVideos": [
    {
      "id": "t1",
      "title": "Raaz Beyond Fear",
      "category": "Thriller",
      "aspect": "landscape",
      "thumb": "/img/newlandscape/RAAZ BEYOND FEAR.jpg",
      "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/7a4a75b5-c88f-42cf-9bf6-219479cd05e5/play_480p.mp4"
    },
    {
      "id": "t2",
      "title": "The Hidden Truth",
      "category": "Thriller",
      "aspect": "landscape",
      "thumb": "/img/newlandscape/THE HIDDEN TRUTH.jpg",
      "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/4a7b3bca-46b6-4ea8-88ed-03b374b4664f/play_480p.mp4"
    },
    {
      "id": "t3",
      "title": "Silent Chase",
      "category": "Action",
      "aspect": "landscape",
      "thumb": "/img/newlandscape/SCILENT CHASE.jpg",
      "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/d6d3724c-e5fe-45bc-8a98-6a2c2f39d60b/play_480p.mp4"
    },
    {
      "id": "t4",
      "title": "The Missing Witness",
      "category": "Mystery",
      "aspect": "landscape",
      "thumb": "/img/newlandscape/THE MISSING WITNESS.jpg",
      "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/af831cce-bcaf-4631-9817-e835f5f0d5db/play_480p.mp4"
    },
    {
      "id": "t5",
      "title": "The Secret Route Ep 1",
      "category": "Drama",
      "aspect": "landscape",
      "thumb": "/img/newlandscape/THE SECRET ROUT EP 1.jpg",
      "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/51f664a4-dfe0-46b7-be10-e3ed819c3ec1/play_480p.mp4"
    },
    {
      "id": "t6",
      "title": "The Secret Route Ep 2",
      "category": "Drama",
      "aspect": "landscape",
      "thumb": "/img/newlandscape/THE SECRET ROUT EP 2.jpg",
      "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/6bf9873a-bbdb-4253-a0b8-3ce37b046c87/play_480p.mp4"
    },
    {
      "id": "t7",
      "title": "Raaz, Revenge & Mafia Ep1",
      "category": "Crime",
      "aspect": "landscape",
      "thumb": "/img/newlandscape/RAAZ, REVENGE & MAFIA EP1.jpg",
      "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/28547fd1-f01a-4b0b-9b68-0729d2a8e8c2/play_480p.mp4"
    },
    {
      "id": "t8",
      "title": "Raaz, Revenge & Mafia Ep2",
      "category": "Crime",
      "aspect": "landscape",
      "thumb": "/img/newlandscape/RAAZ, REVENGE & MAFIA EP2.jpg",
      "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/f4ad3455-6bfc-4436-8d0d-543d1eec8d28/play_480p.mp4"
    },
    {
      "id": "t9",
      "title": "Silent Trigger",
      "category": "Action",
      "aspect": "landscape",
      "thumb": "/img/newlandscape/SCILENT TRIGGER.jpg",
      "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/5f4e3635-6eb7-4ad5-a2aa-400541d22e96/play_480p.mp4"
    },
    {
      "id": "t10",
      "title": "The Forbidden Files",
      "category": "Mystery",
      "aspect": "landscape",
      "thumb": "/img/newlandscape/THE FORBIDDEN FILES.jpg",
      "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/85f84324-4088-4cc8-8ea2-ca99cb7bc568/play_480p.mp4"
    }
  ],
  "fatalConnectionsVideos": [
    { "id": "v11", "title": "FATAL CONNECTIONS EP1", "category": "Thriller", "aspect": "landscape", "thumb": "/img/newlandscape/FATAL CONNECTIONS EP1.jpg", "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/2599bc17-5da5-4ebe-88c6-4e388cfb6e7a/play_480p.mp4" },
    { "id": "v12", "title": "FATAL CONNECTIONS EP2", "category": "Thriller", "aspect": "landscape", "thumb": "/img/newlandscape/FATAL CONNECTIONS EP2.jpg", "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/c82bbf6f-2701-41ec-bf2a-56c1661ed780/play_480p.mp4" },
    { "id": "v13", "title": "FATAL CONNECTIONS EP3", "category": "Thriller", "aspect": "landscape", "thumb": "/img/newlandscape/FATAL CONNECTIONS EP3.jpg", "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/e039a210-2833-4540-8ed2-882920df66ad/play_480p.mp4" },
    { "id": "v14", "title": "THE HIDDEN ENEMY", "category": "Thriller", "aspect": "landscape", "thumb": "/img/newlandscape/THE HIDDEN ENEMY.jpg", "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/47557aed-0f85-45cf-a818-19fd88a2b8de/play_480p.mp4" },
    { "id": "v15", "title": "ESCAPE FROM NOWHERE", "category": "Action", "aspect": "landscape", "thumb": "/img/newlandscape/ESCAPE FROM NOWHERE.jpg", "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/80d10199-16c3-433f-8802-de52a258588c/play_480p.mp4" },
    { "id": "v16", "title": "THE FINAL SECRET", "category": "Mystery", "aspect": "landscape", "thumb": "/img/newlandscape/THE FINAL SECRET.jpg", "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/3ed4455a-3408-42e9-bf9a-5f45d616ad76/play_480p.mp4" },
    { "id": "v17", "title": "THE SECRET ORDER", "category": "Thriller", "aspect": "landscape", "thumb": "/img/newlandscape/THE SECRET ORDER.jpg", "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/397c0570-5de5-4bd3-9a4b-c4063c2e977c/play_480p.mp4" },
    { "id": "v18", "title": "THE FINAL DHOKHA", "category": "Drama", "aspect": "landscape", "thumb": "/img/newlandscape/THE FINAL DHOKHA.jpg", "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/890fe0ae-1956-4409-a9fe-635ff0c7a711/play_480p.mp4" },
    { "id": "v20", "title": "BLACK DIARY SECRETS EP2", "category": "Mystery", "aspect": "landscape", "thumb": "/img/newlandscape/BLACK DIARY SECRETS  EP2.jpg", "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/34f1001c-5f45-4a80-8a76-a2bee40bb09a/play_480p.mp4" },
    { "id": "v102", "title": "MIDNIGHT CASE", "category": "Mystery", "aspect": "landscape", "thumb": "/img/newlandscape/MIDNIGHT CASE.jpg", "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/cdb7b936-b110-48c7-acaa-a5bad2fc57bd/play_480p.mp4" },
    { "id": "v99", "title": "BLACK HORIZON", "category": "Thriller", "aspect": "landscape", "thumb": "/img/newlandscape/BLACK HORIZON.jpg", "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/716f0c5e-3509-4f1c-84e6-f5838a0300b5/play_480p.mp4" },
    { "id": "v51", "title": "MYSTERY JUNCTION", "category": "Mystery", "aspect": "landscape", "thumb": "/img/newlandscape/MYSTERY JUNCTION.jpg", "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/28e8218c-9ab8-43d9-a375-c8911de661fd/play_480p.mp4" },
    { "id": "v34", "title": "FINAL COUNTDOWN", "category": "Action", "aspect": "landscape", "thumb": "/img/newlandscape/FINAL COUNTDOWN.jpg", "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/3514fd24-dc36-41f6-92ee-d0c151f16021/play_480p.mp4" },
    { "id": "v91", "title": "CHASE TO DANGER EP1", "category": "Action", "aspect": "landscape", "thumb": "/img/newlandscape/CHASE TO DANGER EP1.jpg", "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/2ca7a8c9-3c22-40d7-9b8f-ad9c9be989cb/play_480p.mp4" },
    { "id": "v74", "title": "HIDDEN FEAR EP2", "category": "Thriller", "aspect": "landscape", "thumb": "/img/newlandscape/HIDDEN FEAR EP2.jpg", "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/df61e791-f5e0-48cd-bfbb-49c5afbd2b84/play_480p.mp4" },
    { "id": "v79", "title": "SHADOW FORCE", "category": "Action", "aspect": "landscape", "thumb": "/img/newlandscape/SHADOW FORCE.jpg", "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/86344b4d-c5c0-42cd-8d51-2ea14e6215ad/play_480p.mp4" }
  ],
  "missionVideos": [
    {
      "id": "v21",
      "title": "FINAL WITNESS",
      "category": "Thriller",
      "aspect": "portrait",
      "thumb": "p21.png",
      "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/a74bf4eb-3380-4b9b-b091-9ec09acbd22d/play_480p.mp4"
    },
    {
      "id": "v22",
      "title": "THE MISSING LINK",
      "category": "Mystery",
      "aspect": "portrait",
      "thumb": "p22.png",
      "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/11444673-b5cf-43a1-a6fa-7cc8e4552e96/play_480p.mp4"
    },
    {
      "id": "v23",
      "title": "DEAD END MISSON",
      "category": "Action",
      "aspect": "portrait",
      "thumb": "p23.png",
      "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/77627729-6d06-45f5-9f26-c5362bf33fc2/play_480p.mp4"
    },
    {
      "id": "v24",
      "title": "DANGEROUS ALLIANCE",
      "category": "Thriller",
      "aspect": "portrait",
      "thumb": "p24.png",
      "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/84b04739-d8f4-4a60-9a0c-1956fc0c562d/play_480p.mp4"
    },
    {
      "id": "v25",
      "title": "ESCAPE PLAN 302",
      "category": "Action",
      "aspect": "portrait",
      "thumb": "p25.png",
      "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/eeb54276-c87d-418e-b19c-0dcf00dad105/play_480p.mp4"
    },
    {
      "id": "v27",
      "title": "OPERATION NIGHTFALL",
      "category": "Thriller",
      "aspect": "portrait",
      "thumb": "p27.png",
      "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/28d84155-2e99-4633-833d-01bfb7187dd3/play_480p.mp4"
    },
    {
      "id": "v28",
      "title": "DANGEROUS MINDS EP1",
      "category": "Drama",
      "aspect": "portrait",
      "thumb": "p28.png",
      "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/da939e64-f3d5-495d-9c7a-6edb64925d1e/play_480p.mp4"
    },
    {
      "id": "v29",
      "title": "DANGEROUS MINDS EP2",
      "category": "Drama",
      "aspect": "portrait",
      "thumb": "p29.png",
      "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/fd099482-0261-4b67-b760-f2cbcf8e06df/play_480p.mp4"
    },
    {
      "id": "v30",
      "title": "DANGEROUS MINDS EP3",
      "category": "Drama",
      "aspect": "portrait",
      "thumb": "p30.png",
      "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/fd099482-0261-4b67-b760-f2cbcf8e06df/play_480p.mp4"
    }
  ],
  "dangerousMindsVideos": [
    {
      "id": "v31",
      "title": "DANGEROUS MINDS EP4",
      "category": "Drama",
      "aspect": "landscape",
      "thumb": "l31.png",
      "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/fb60c689-0ae6-4d37-9e7a-0a6fd490aef0/play_480p.mp4"
    },
    {
      "id": "v34",
      "title": "FINAL COUNTDOWN",
      "category": "Action",
      "aspect": "landscape",
      "thumb": "l34.png",
      "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/3514fd24-dc36-41f6-92ee-d0c151f16021/play_480p.mp4"
    },
    {
      "id": "v35",
      "title": "THE DARK NETWORK",
      "category": "Crime",
      "aspect": "landscape",
      "thumb": "l35.png",
      "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/a9c3c48b-795d-400d-9483-40f612740a21/play_480p.mp4"
    },
    {
      "id": "v36",
      "title": "THE SECRET MISSION",
      "category": "Action",
      "aspect": "landscape",
      "thumb": "l36.png",
      "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/71121b34-eb1f-4a5d-984a-e1661e402d2d/play_480p.mp4"
    },
    {
      "id": "v37",
      "title": "THE SECRET SYNDICATE",
      "category": "Crime",
      "aspect": "landscape",
      "thumb": "l37.png",
      "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/6cffca6b-7759-40e7-84de-c97856b4c7be/play_480p.mp4"
    },
    {
      "id": "v38",
      "title": "THE UNKNOWN TARGET",
      "category": "Thriller",
      "aspect": "landscape",
      "thumb": "l38.png",
      "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/cb6cdbd5-e1d3-470c-ab5c-a7e8bcb58945/play_480p.mp4"
    },
    {
      "id": "v39",
      "title": "WANTED FOR REVENGE",
      "category": "Action",
      "aspect": "landscape",
      "thumb": "l39.png",
      "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/8a65b7aa-fa05-4a1e-9d25-3d34a0af19b5/play_480p.mp4"
    },
    {
      "id": "v40",
      "title": "LAST MISSION ALIVE",
      "category": "Thriller",
      "aspect": "landscape",
      "thumb": "l40.png",
      "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/a1d91030-cf54-420a-9b1c-4afe9ba19e15/play_480p.mp4"
    }
  ],
  "escapeSeriesVideos": [
    {
      "id": "v41",
      "title": "MIDNIGHT ESCAPE",
      "category": "Thriller",
      "aspect": "portrait",
      "thumb": "p41.png",
      "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/9ac5b5f9-d682-44a7-b877-772dec4b380d/play_480p.mp4"
    },
    {
      "id": "v42",
      "title": "THE DIARY SECRETS",
      "category": "Mystery",
      "aspect": "portrait",
      "thumb": "p42.png",
      "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/d1f6716d-b7b1-41c3-8e4a-fd7204a75a74/play_480p.mp4"
    },
    {
      "id": "v43",
      "title": "HER STORY",
      "category": "Drama",
      "aspect": "portrait",
      "thumb": "p43.png",
      "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/e8ad8fc4-49fa-43ab-9fda-36916e56d066/play_480p.mp4"
    },
    {
      "id": "v44",
      "title": "DANGEROUS TERRITORY",
      "category": "Action",
      "aspect": "portrait",
      "thumb": "p44.png",
      "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/89953c37-edf9-4b6d-85eb-eeb8251f4818/play_480p.mp4"
    },
    {
      "id": "v45",
      "title": "SHADOW PROTOCOL",
      "category": "Thriller",
      "aspect": "portrait",
      "thumb": "p45.png",
      "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/08ebb0ad-11cd-458a-823b-3e19382347aa/play_480p.mp4"
    },
    {
      "id": "v47",
      "title": "ESCAPE BEYOND FEAR EP2",
      "category": "Thriller",
      "aspect": "portrait",
      "thumb": "p47.png",
      "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/e2c089c7-9466-462d-93c7-a72a539672b6/play_480p.mp4"
    },
    {
      "id": "v49",
      "title": "UNDERGROUND WARRIORS EP1",
      "category": "Action",
      "aspect": "portrait",
      "thumb": "p49.png",
      "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/f614d9ea-0e47-4fd0-97ec-45b26b6eac42/play_480p.mp4"
    },
    {
      "id": "v50",
      "title": "UNDERGROUND WARRIORS EP2",
      "category": "Action",
      "aspect": "portrait",
      "thumb": "p50.png",
      "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/30f1099b-78b3-43e8-ae24-72ba766b57e6/play_480p.mp4"
    }
  ],
  "mysteryFilesVideos": [
    {
      "id": "v51",
      "title": "MYSTERY JUNCTION",
      "category": "Mystery",
      "aspect": "landscape",
      "thumb": "l51.png",
      "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/28e8218c-9ab8-43d9-a375-c8911de661fd/play_480p.mp4"
    },
    {
      "id": "v52",
      "title": "DARK CITY FILES",
      "category": "Crime",
      "aspect": "landscape",
      "thumb": "l52.png",
      "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/64ef26c1-c28b-4cd4-926e-7f878f62e2c1/play_480p.mp4"
    },
    {
      "id": "v54",
      "title": "WANTED BY DARKNESS",
      "category": "Thriller",
      "aspect": "landscape",
      "thumb": "l54.png",
      "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/153805c9-a16e-48fc-8bdd-e33db79cb737/play_480p.mp4"
    },
    {
      "id": "v55",
      "title": "UNKNOWN ENEMY EP1",
      "category": "Thriller",
      "aspect": "landscape",
      "thumb": "l55.png",
      "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/0eacbf8f-3c0a-409b-8874-bb298c466933/play_480p.mp4"
    },
    {
      "id": "v56",
      "title": "UNKNOWN ENEMY EP2",
      "category": "Thriller",
      "aspect": "landscape",
      "thumb": "l56.png",
      "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/fc6a7905-ca95-44d9-a814-a101961bfb2b/play_480p.mp4"
    },
    {
      "id": "v57",
      "title": "UNKNOWN ENEMY EP3",
      "category": "Thriller",
      "aspect": "landscape",
      "thumb": "l57.png",
      "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/c4bcdd12-b1f3-4598-9ffc-b7072ac2d354/play_480p.mp4"
    },
    {
      "id": "v58",
      "title": "THE SHADOW GAME EP1",
      "category": "Mystery",
      "aspect": "landscape",
      "thumb": "l58.png",
      "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/5cd8a869-e025-4b8d-9dec-5d34c38c4a37/play_480p.mp4"
    },
    {
      "id": "v59",
      "title": "THE SHADOW GAME EP2",
      "category": "Mystery",
      "aspect": "landscape",
      "thumb": "l59.png",
      "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/1180b80a-fca0-402d-b86e-6c25988818ba/play_480p.mp4"
    },
    {
      "id": "v60",
      "title": "THE SHADOW GAME EP3",
      "category": "Mystery",
      "aspect": "landscape",
      "thumb": "l60.png",
      "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/463534cc-d355-4fe9-b6da-53277140f4cd/play_480p.mp4"
    }
  ],
  "shadowGameVideos": [
    {
      "id": "v61",
      "title": "THE SHADOW GAME EP4",
      "category": "Mystery",
      "aspect": "portrait",
      "thumb": "p61.png",
      "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/8c586fdf-c6b1-4dec-83b2-a700c2ae3c1a/play_480p.mp4"
    },
    {
      "id": "v62",
      "title": "THE FITNESS TRAP",
      "category": "Thriller",
      "aspect": "portrait",
      "thumb": "p62.png",
      "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/a74bbde6-2f05-49b7-88b5-68ad82b4186c/play_480p.mp4"
    },
    {
      "id": "v64",
      "title": "THE CRIME CIRCLE",
      "category": "Crime",
      "aspect": "portrait",
      "thumb": "p64.png",
      "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/912b01f0-6f55-491b-931d-7cda175785e2/play_480p.mp4"
    },
    {
      "id": "v65",
      "title": "SECRET NIGHTS",
      "category": "Drama",
      "aspect": "portrait",
      "thumb": "p65.png",
      "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/8b2ccb4d-032d-4671-b3fe-7459f7bf6e4c/play_480p.mp4"
    },
    {
      "id": "v66",
      "title": "MISSSION DARKNIGHT",
      "category": "Action",
      "aspect": "portrait",
      "thumb": "p66.png",
      "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/639f02ab-e3db-434a-872a-72b38b4b277e/play_480p.mp4"
    },
    {
      "id": "v67",
      "title": "ADVENTURE KE RAAZ",
      "category": "Adventure",
      "aspect": "portrait",
      "thumb": "p67.png",
      "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/919cb0e1-f1dc-40f5-8698-59bdfa0d2fd4/play_480p.mp4"
    },
    {
      "id": "v68",
      "title": "KILLER INSTINCT",
      "category": "Thriller",
      "aspect": "portrait",
      "thumb": "p68.png",
      "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/b920eca1-3a4a-4fce-bebd-0a9d2633e4f3/play_480p.mp4"
    },
    {
      "id": "v69",
      "title": "ESCAPE ROUT 21",
      "category": "Action",
      "aspect": "portrait",
      "thumb": "p69.png",
      "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/95e1a708-9d85-476c-83cd-a0f656f46dd4/play_480p.mp4"
    },
    {
      "id": "v70",
      "title": "BLACK SIGNAL",
      "category": "Thriller",
      "aspect": "portrait",
      "thumb": "p70.png",
      "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/f5c0b07d-5a7f-4df6-b906-1f7a2f0cef76/play_480p.mp4"
    }
  ],
  "rogueNationVideos": [
    {
      "id": "v71",
      "title": "ROGUE NATION",
      "category": "Action",
      "aspect": "landscape",
      "thumb": "l71.png",
      "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/914c52d0-5a98-43f5-992a-beaddefb5ab1/play_480p.mp4"
    },
    {
      "id": "v72",
      "title": "SILENT WITNESS",
      "category": "Thriller",
      "aspect": "landscape",
      "thumb": "l72.png",
      "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/a0f4772a-4376-44b1-a458-b50eff38a0e0/play_480p.mp4"
    },
    {
      "id": "v73",
      "title": "HIDDEN FEAR EP1",
      "category": "Thriller",
      "aspect": "landscape",
      "thumb": "l73.png",
      "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/d72d661d-325f-4d19-b173-bf88746ddc7a/play_480p.mp4"
    },
    {
      "id": "v74",
      "title": "HIDDEN FEAR EP2",
      "category": "Thriller",
      "aspect": "landscape",
      "thumb": "l74.png",
      "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/df61e791-f5e0-48cd-bfbb-49c5afbd2b84/play_480p.mp4"
    },
    {
      "id": "v75",
      "title": "HIDDEN FEAR EP3",
      "category": "Thriller",
      "aspect": "landscape",
      "thumb": "l75.png",
      "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/cf401e32-06ee-4fe9-a6eb-53fe6e441d72/play_480p.mp4"
    },
    {
      "id": "v76",
      "title": "HIDDEN FEAR EP4",
      "category": "Thriller",
      "aspect": "landscape",
      "thumb": "l76.png",
      "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/311aa2ba-164c-41b8-b9d1-910063c83d5d/play_480p.mp4"
    },
    {
      "id": "v77",
      "title": "THE SILENT HUNT",
      "category": "Mystery",
      "aspect": "landscape",
      "thumb": "l77.png",
      "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/4941972e-1692-4d0b-ab19-28887a806631/play_480p.mp4"
    },
    {
      "id": "v78",
      "title": "THE LAST CHANCE",
      "category": "Drama",
      "aspect": "landscape",
      "thumb": "l78.png",
      "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/20428f28-cc91-4463-bb07-df334be38ab3/play_480p.mp4"
    },
    {
      "id": "v79",
      "title": "SHADOW FORCE",
      "category": "Action",
      "aspect": "landscape",
      "thumb": "l79.png",
      "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/86344b4d-c5c0-42cd-8d51-2ea14e6215ad/play_480p.mp4"
    },
  ],
  "mysteryAvenueVideos": [
    {
      "id": "v82",
      "title": "DANGEROUS DESTINATION EP1",
      "category": "Thriller",
      "aspect": "portrait",
      "thumb": "p82.png",
      "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/6e1962ba-dbcc-4c2b-963a-d3176124deb4/play_480p.mp4"
    },
    {
      "id": "v83",
      "title": "DANGEROUS DESTINATION EP2",
      "category": "Thriller",
      "aspect": "portrait",
      "thumb": "p83.png",
      "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/4527946b-8e26-4e53-87da-ab74f2313614/play_480p.mp4"
    },
    {
      "id": "v84",
      "title": "DANGEROUS DESTINATION EP3",
      "category": "Thriller",
      "aspect": "portrait",
      "thumb": "p84.png",
      "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/613259cb-60be-4296-96ca-63ebc21922c0/play_480p.mp4"
    },
    {
      "id": "v85",
      "title": "DANGEROUS DESTINATION EP4",
      "category": "Thriller",
      "aspect": "portrait",
      "thumb": "p85.png",
      "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/2c902c65-1f63-4855-be88-cee69e2ac9a0/play_480p.mp4"
    },
    {
      "id": "v86",
      "title": "KILLER WALI RAAT",
      "category": "Thriller",
      "aspect": "portrait",
      "thumb": "p86.png",
      "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/436a5e04-04b6-4bcc-bd2d-c54939083b0c/play_480p.mp4"
    },
    {
      "id": "v87",
      "title": "CODE RED MAFIA",
      "category": "Crime",
      "aspect": "portrait",
      "thumb": "p87.png",
      "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/29215cc6-4174-406b-a21d-71122bc7336a/play_480p.mp4"
    },
    {
      "id": "v88",
      "title": "BLACKMAIL JUNCTION",
      "category": "Crime",
      "aspect": "portrait",
      "thumb": "p88.png",
      "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/40448adf-7577-4a1b-8bbb-0c0e1dedbb46/play_480p.mp4"
    },
    {
      "id": "v89",
      "title": "THE UNOFFICIAL NETWORK",
      "category": "Thriller",
      "aspect": "portrait",
      "thumb": "p89.png",
      "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/a90c6024-768c-4c24-87d4-07612b07477a/play_480p.mp4"
    },
  ],
  "chaseToDangerVideos": [
    {
      "id": "v91",
      "title": "CHASE TO DANGER EP1",
      "category": "Action",
      "aspect": "landscape",
      "thumb": "l91.png",
      "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/2ca7a8c9-3c22-40d7-9b8f-ad9c9be989cb/play_480p.mp4"
    },
    {
      "id": "v92",
      "title": "CHASE TO DANGER EP2",
      "category": "Action",
      "aspect": "landscape",
      "thumb": "l92.png",
      "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/671096db-84aa-4452-8298-d564b5fe5a41/play_480p.mp4"
    },
    {
      "id": "v93",
      "title": "CHASE TO DANGER EP3",
      "category": "Action",
      "aspect": "landscape",
      "thumb": "l93.png",
      "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/9d656763-670c-49e0-b721-ba6e9291b17b/play_480p.mp4"
    },
    {
      "id": "v94",
      "title": "CHASE TO DANGER EP4",
      "category": "Action",
      "aspect": "landscape",
      "thumb": "l94.png",
      "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/af763878-2990-48bd-83f1-b396dbce21f7/play_480p.mp4"
    },
    {
      "id": "v96",
      "title": "THE LAST TRUTH EP1",
      "category": "Drama",
      "aspect": "landscape",
      "thumb": "l96.png",
      "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/710a74b7-ec71-4504-abc9-d231aa23c2ec/play_480p.mp4"
    },
    {
      "id": "v97",
      "title": "THE LAST TRUTH EP2",
      "category": "Drama",
      "aspect": "landscape",
      "thumb": "l97.png",
      "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/4851e395-3c41-44b6-a99a-06816305990e/play_480p.mp4"
    },
    {
      "id": "v98",
      "title": "CRIME SYNDICATE",
      "category": "Crime",
      "aspect": "landscape",
      "thumb": "l98.png",
      "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/f5cbe468-f999-49b6-9bc0-1bd9c4451d5e/play_480p.mp4"
    },
    {
      "id": "v99",
      "title": "BLACK HORIZON",
      "category": "Thriller",
      "aspect": "landscape",
      "thumb": "l99.png",
      "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/716f0c5e-3509-4f1c-84e6-f5838a0300b5/play_480p.mp4"
    },
    {
      "id": "v100",
      "title": "DARK EMPIRE",
      "category": "Crime",
      "aspect": "landscape",
      "thumb": "l100.png",
      "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/2c0ea145-e0d1-44a9-8a3b-b3a40b01f11a/play_480p.mp4"
    },
    {
      "id": "v101",
      "title": "ADVENTURE BEYOND BORDERS",
      "category": "Adventure",
      "aspect": "landscape",
      "thumb": "l101.png",
      "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/6dfc4323-4ae3-428e-9866-13053dbd731c/play_480p.mp4"
    },
    {
      "id": "v102",
      "title": "MIDNIGHT CASE",
      "category": "Mystery",
      "aspect": "landscape",
      "thumb": "l102.png",
      "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/cdb7b936-b110-48c7-acaa-a5bad2fc57bd/play_480p.mp4"
    }
  ],
  "spotlightVideos": [],
  "midnightVideos": [
    { "id": "v102", "title": "MIDNIGHT CASE", "category": "Mystery", "aspect": "landscape", "thumb": "/img/newlandscape/MIDNIGHT CASE.jpg", "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/cdb7b936-b110-48c7-acaa-a5bad2fc57bd/play_480p.mp4" },
    { "id": "v99", "title": "BLACK HORIZON", "category": "Thriller", "aspect": "landscape", "thumb": "/img/newlandscape/BLACK HORIZON.jpg", "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/716f0c5e-3509-4f1c-84e6-f5838a0300b5/play_480p.mp4" },
    { "id": "v100", "title": "DARK EMPIRE", "category": "Crime", "aspect": "landscape", "thumb": "/img/newlandscape/DARK EMPIRE.jpg", "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/2c0ea145-e0d1-44a9-8a3b-b3a40b01f11a/play_480p.mp4" },
    { "id": "v91", "title": "CHASE TO DANGER EP1", "category": "Action", "aspect": "landscape", "thumb": "/img/newlandscape/CHASE TO DANGER EP1.jpg", "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/2ca7a8c9-3c22-40d7-9b8f-ad9c9be989cb/play_480p.mp4" },
    { "id": "v88", "title": "BLACKMAIL JUNCTION", "category": "Crime", "aspect": "landscape", "thumb": "/img/newportrait/BLACKMAIL JUNCTION.jpg", "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/40448adf-7577-4a1b-8bbb-0c0e1dedbb46/play_480p.mp4" },
    { "id": "v76", "title": "HIDDEN FEAR EP4", "category": "Thriller", "aspect": "landscape", "thumb": "/img/newlandscape/HIDDEN FEAR EP4.jpg", "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/311aa2ba-164c-41b8-b9d1-910063c83d5d/play_480p.mp4" },
    { "id": "v79", "title": "SHADOW FORCE", "category": "Action", "aspect": "landscape", "thumb": "/img/newlandscape/SHADOW FORCE.jpg", "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/86344b4d-c5c0-42cd-8d51-2ea14e6215ad/play_480p.mp4" },
    { "id": "v75", "title": "HIDDEN FEAR EP3", "category": "Thriller", "aspect": "landscape", "thumb": "/img/newlandscape/HIDDEN FEAR EP3.jpg", "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/cf401e32-06ee-4fe9-a6eb-53fe6e441d72/play_480p.mp4" }
  ],
  "portraitGridVideos": [
    { "id": "v74", "title": "HIDDEN FEAR EP2", "category": "Thriller", "aspect": "landscape", "thumb": "/img/newlandscape/HIDDEN FEAR EP2.jpg", "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/df61e791-f5e0-48cd-bfbb-49c5afbd2b84/play_480p.mp4" },
    { "id": "v73", "title": "HIDDEN FEAR EP1", "category": "Thriller", "aspect": "landscape", "thumb": "/img/newlandscape/HIDDEN FEAR EP1.jpg", "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/d72d661d-325f-4d19-b173-bf88746ddc7a/play_480p.mp4" },
    { "id": "v75", "title": "HIDDEN FEAR EP3", "category": "Thriller", "aspect": "landscape", "thumb": "/img/newlandscape/HIDDEN FEAR EP3.jpg", "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/cf401e32-06ee-4fe9-a6eb-53fe6e441d72/play_480p.mp4" },
    { "id": "v76", "title": "HIDDEN FEAR EP4", "category": "Thriller", "aspect": "landscape", "thumb": "/img/newlandscape/HIDDEN FEAR EP4.jpg", "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/311aa2ba-164c-41b8-b9d1-910063c83d5d/play_480p.mp4" },
    { "id": "t10", "title": "THE FORBIDDEN FILES", "category": "Mystery", "aspect": "landscape", "thumb": "/img/newlandscape/THE FORBIDDEN FILES.jpg", "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/85f84324-4088-4cc8-8ea2-ca99cb7bc568/play_480p.mp4" },
    { "id": "v59", "title": "THE SHADOW GAME EP2", "category": "Thriller", "aspect": "landscape", "thumb": "/img/newlandscape/THE SHADOW GAME EP2.jpg", "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/1180b80a-fca0-402d-b86e-6c25988818ba/play_480p.mp4" },
    { "id": "v15", "title": "ESCAPE FROM NOWHERE", "category": "Action", "aspect": "landscape", "thumb": "/img/newlandscape/ESCAPE FROM NOWHERE.jpg", "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/80d10199-16c3-433f-8802-de52a258588c/play_480p.mp4" },
    { "id": "v58", "title": "THE SHADOW GAME EP1", "category": "Thriller", "aspect": "landscape", "thumb": "/img/newlandscape/THE SHADOW GAME EP1.jpg", "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/5cd8a869-e025-4b8d-9dec-5d34c38c4a37/play_480p.mp4" }
  ],
  "wantedLandscapeVideos": [
    { "id": "v49", "title": "UNDERGROUND WARRIORS EP1", "category": "Action", "aspect": "portrait", "thumb": "/img/newportrait/UNDERGROUND WARRIORS EP1.jpg", "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/f614d9ea-0e47-4fd0-97ec-45b26b6eac42/play_480p.mp4" },
    { "id": "v50", "title": "UNDERGROUND WARRIORS EP2", "category": "Action", "aspect": "portrait", "thumb": "/img/newportrait/UNDERGROUND WARRIORS EP2.jpg", "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/30f1099b-78b3-43e8-ae24-72ba766b57e6/play_480p.mp4" },
    { "id": "v44", "title": "DANGEROUS TERRITORY", "category": "Action", "aspect": "portrait", "thumb": "/img/newportrait/DANGEROUS TERRITORY.jpg", "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/89953c37-edf9-4b6d-85eb-eeb8251f4818/play_480p.mp4" },
    { "id": "v61", "title": "THE SHADOW GAME EP4", "category": "Thriller", "aspect": "portrait", "thumb": "/img/newportrait/THE SHADOW GAME EP4.jpg", "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/8c586fdf-c6b1-4dec-83b2-a700c2ae3c1a/play_480p.mp4" },
    { "id": "v88", "title": "BLACKMAIL JUNCTION", "category": "Crime", "aspect": "portrait", "thumb": "/img/newportrait/BLACKMAIL JUNCTION.jpg", "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/40448adf-7577-4a1b-8bbb-0c0e1dedbb46/play_480p.mp4" },
    { "id": "v70", "title": "BLACK SIGNAL", "category": "Crime", "aspect": "portrait", "thumb": "/img/newportrait/BLACK SIGNAL.jpg", "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/f5c0b07d-5a7f-4df6-b906-1f7a2f0cef76/play_480p.mp4" },
    { "id": "v24", "title": "DANGEROUS ALLIANCE", "category": "Thriller", "aspect": "portrait", "thumb": "/img/newportrait/DANGEROUS ALLIANCE.jpg", "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/84b04739-d8f4-4a60-9a0c-1956fc0c562d/play_480p.mp4" },
    { "id": "v45", "title": "SHADOW PROTOCOL", "category": "Thriller", "aspect": "portrait", "thumb": "/img/newportrait/SHADOW PROTOCOL.jpg", "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/08ebb0ad-11cd-458a-823b-3e19382347aa/play_480p.mp4" }
  ],
  "darkMindsPortraitVideos": [
    { "id": "v31", "title": "DANGEROUS MINDS EP4", "category": "Thriller", "aspect": "landscape", "thumb": "/img/newlandscape/DANGEROUS MINDS EP4.jpg", "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/fb60c689-0ae6-4d37-9e7a-0a6fd490aef0/play_480p.mp4" },
    { "id": "v36", "title": "THE SECRET MISSION", "category": "Action", "aspect": "landscape", "thumb": "/img/newlandscape/THE SECRET MISSION.jpg", "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/71121b34-eb1f-4a5d-984a-e1661e402d2d/play_480p.mp4" },
    { "id": "v35", "title": "THE DARK NETWORK", "category": "Crime", "aspect": "landscape", "thumb": "/img/newlandscape/THE DARK NETWORK.jpg", "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/a9c3c48b-795d-400d-9483-40f612740a21/play_480p.mp4" },
    { "id": "v71", "title": "ROGUE NATION", "category": "Action", "aspect": "landscape", "thumb": "/img/newlandscape/ROGUE NATION.jpg", "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/914c52d0-5a98-43f5-992a-beaddefb5ab1/play_480p.mp4" },
    { "id": "v34", "title": "FINAL COUNTDOWN", "category": "Action", "aspect": "landscape", "thumb": "/img/newlandscape/FINAL COUNTDOWN.jpg", "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/3514fd24-dc36-41f6-92ee-d0c151f16021/play_480p.mp4" },
    { "id": "v100", "title": "DARK EMPIRE", "category": "Crime", "aspect": "landscape", "thumb": "/img/newlandscape/DARK EMPIRE.jpg", "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/2c0ea145-e0d1-44a9-8a3b-b3a40b01f11a/play_480p.mp4" },
    { "id": "v52", "title": "DARK CITY FILES", "category": "Crime", "aspect": "landscape", "thumb": "/img/newlandscape/DARK CITY FILES.jpg", "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/64ef26c1-c28b-4cd4-926e-7f878f62e2c1/play_480p.mp4" },
    { "id": "v37", "title": "THE SECRET SYNDICATE", "category": "Crime", "aspect": "landscape", "thumb": "/img/newlandscape/THE SECRET SYNDICATE.jpg", "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/6cffca6b-7759-40e7-84de-c97856b4c7be/play_480p.mp4" }
  ],
  "finalStrikePortraitVideos": [
    { "id": "v25", "title": "ESCAPE PLAN 302", "category": "Action", "aspect": "portrait", "thumb": "/img/newportrait/ESCAPE PLAN 302.jpg", "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/eeb54276-c87d-418e-b19c-0dcf00dad105/play_480p.mp4" },
    { "id": "v23", "title": "DEAD END MISSON", "category": "Action", "aspect": "portrait", "thumb": "/img/newportrait/DEAD END MISSON.jpg", "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/77627729-6d06-45f5-9f26-c5362bf33fc2/play_480p.mp4" },
    { "id": "v69", "title": "ESCAPE ROUT 21", "category": "Action", "aspect": "portrait", "thumb": "/img/newportrait/ESCAPE ROUT 21.jpg", "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/95e1a708-9d85-476c-83cd-a0f656f46dd4/play_480p.mp4" },
    { "id": "v68", "title": "KILLER INSTINCT", "category": "Thriller", "aspect": "portrait", "thumb": "/img/newportrait/KILLER INSTINCT.jpg", "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/b920eca1-3a4a-4fce-bebd-0a9d2633e4f3/play_480p.mp4" },
    { "id": "v86", "title": "KILLER WALI RAAT", "category": "Thriller", "aspect": "portrait", "thumb": "/img/newportrait/KILLER WALI RAAT.jpg", "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/436a5e04-04b6-4bcc-bd2d-c54939083b0c/play_480p.mp4" },
    { "id": "v66", "title": "MISSSION DARKNIGHT", "category": "Action", "aspect": "portrait", "thumb": "/img/newportrait/MISSSION DARKNIGHT.jpg", "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/639f02ab-e3db-434a-872a-72b38b4b277e/play_480p.mp4" },
    { "id": "v87", "title": "CODE RED MAFIA", "category": "Crime", "aspect": "portrait", "thumb": "/img/newportrait/CODE RED MAFIA.jpg", "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/29215cc6-4174-406b-a21d-71122bc7336a/play_480p.mp4" },
    { "id": "v21", "title": "FINAL WITNESS", "category": "Mystery", "aspect": "portrait", "thumb": "/img/newportrait/FINAL WITNESS.jpg", "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/a74bf4eb-3380-4b9b-b091-9ec09acbd22d/play_480p.mp4" }
  ],
  "secretRouteLandscapeVideos": [
    { "id": "v65", "title": "SECRET NIGHTS", "category": "Thriller", "aspect": "portrait", "thumb": "/img/newportrait/SECRET NIGHTS.jpg", "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/8b2ccb4d-032d-4671-b3fe-7459f7bf6e4c/play_480p.mp4" },
    { "id": "v42", "title": "THE DIARY SECRETS", "category": "Mystery", "aspect": "portrait", "thumb": "/img/newportrait/THE DIARY SECRETS.jpg", "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/d1f6716d-b7b1-41c3-8e4a-fd7204a75a74/play_480p.mp4" },
    { "id": "v22", "title": "THE MISSING LINK", "category": "Mystery", "aspect": "portrait", "thumb": "/img/newportrait/THE MISSING LINK.jpg", "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/11444673-b5cf-43a1-a6fa-7cc8e4552e96/play_480p.mp4" },
    { "id": "v62", "title": "THE FITNESS TRAP", "category": "Thriller", "aspect": "portrait", "thumb": "/img/newportrait/THE FITNESS TRAP.jpg", "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/a74bbde6-2f05-49b7-88b5-68ad82b4186c/play_480p.mp4" },
    { "id": "v67", "title": "ADVENTURE KE RAAZ", "category": "Adventure", "aspect": "portrait", "thumb": "/img/newportrait/ADVENTURE KE RAAZ.jpg", "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/919cb0e1-f1dc-40f5-8698-59bdfa0d2fd4/play_480p.mp4" },
    { "id": "v27", "title": "OPERATION NIGHTFALL", "category": "Thriller", "aspect": "portrait", "thumb": "/img/newportrait/OPERATION NIGHTFALL.jpg", "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/28d84155-2e99-4633-833d-01bfb7187dd3/play_480p.mp4" },
    { "id": "v89", "title": "THE UNOFFICIAL NETWORK", "category": "Crime", "aspect": "portrait", "thumb": "/img/newportrait/THE UNOFFICIAL NETWORK.jpg", "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/a90c6024-768c-4c24-87d4-07612b07477a/play_480p.mp4" },
    { "id": "v82", "title": "DANGEROUS DESTINATION EP1", "category": "Action", "aspect": "portrait", "thumb": "/img/newportrait/DANGEROUS DESTINATION EP1.jpg", "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/6e1962ba-dbcc-4c2b-963a-d3176124deb4/play_480p.mp4" }
  ],
  "afterDeviceLandscapeVideos": [
    { "id": "v20", "title": "BLACK DIARY SECRETS EP2", "category": "Mystery", "aspect": "landscape", "thumb": "/img/newlandscape/BLACK DIARY SECRETS  EP2.jpg", "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/34f1001c-5f45-4a80-8a76-a2bee40bb09a/play_480p.mp4" },
    { "id": "v16", "title": "THE FINAL SECRET", "category": "Mystery", "aspect": "landscape", "thumb": "/img/newlandscape/THE FINAL SECRET.jpg", "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/3ed4455a-3408-42e9-bf9a-5f45d616ad76/play_480p.mp4" },
    { "id": "v38", "title": "THE UNKNOWN TARGET", "category": "Thriller", "aspect": "landscape", "thumb": "/img/newlandscape/THE UNKNOWN TARGET.jpg", "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/cb6cdbd5-e1d3-470c-ab5c-a7e8bcb58945/play_480p.mp4" },
    { "id": "v27", "title": "OPERATION NIGHTFALL", "category": "Thriller", "aspect": "landscape", "thumb": "/img/newlandscape/OPERATION NIGHTFALL.jpg", "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/28d84155-2e99-4633-833d-01bfb7187dd3/play_480p.mp4" },
    { "id": "t10", "title": "THE FORBIDDEN FILES", "category": "Mystery", "aspect": "landscape", "thumb": "/img/newlandscape/THE FORBIDDEN FILES.jpg", "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/85f84324-4088-4cc8-8ea2-ca99cb7bc568/play_480p.mp4" },
    { "id": "v17", "title": "THE SECRET ORDER", "category": "Thriller", "aspect": "landscape", "thumb": "/img/newlandscape/THE SECRET ORDER.jpg", "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/397c0570-5de5-4bd3-9a4b-c4063c2e977c/play_480p.mp4" },
    { "id": "v12", "title": "FATAL CONNECTIONS EP2", "category": "Crime", "aspect": "landscape", "thumb": "/img/newlandscape/FATAL CONNECTIONS EP2.jpg", "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/c82bbf6f-2701-41ec-bf2a-56c1661ed780/play_480p.mp4" },
    { "id": "t2", "title": "THE HIDDEN TRUTH", "category": "Thriller", "aspect": "landscape", "thumb": "/img/newlandscape/THE HIDDEN TRUTH.jpg", "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/4a7b3bca-46b6-4ea8-88ed-03b374b4664f/play_480p.mp4" }
  ],
  "shadowHuntLandscapeVideos": [
    { "id": "v77", "title": "THE SILENT HUNT", "category": "Thriller", "aspect": "landscape", "thumb": "/img/newlandscape/THE SILENT HUNT.jpg", "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/4941972e-1692-4d0b-ab19-28887a806631/play_480p.mp4" },
    { "id": "v79", "title": "SHADOW FORCE", "category": "Action", "aspect": "landscape", "thumb": "/img/newlandscape/SHADOW FORCE.jpg", "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/86344b4d-c5c0-42cd-8d51-2ea14e6215ad/play_480p.mp4" },
    { "id": "v58", "title": "THE SHADOW GAME EP1", "category": "Thriller", "aspect": "landscape", "thumb": "/img/newlandscape/THE SHADOW GAME EP1.jpg", "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/5cd8a869-e025-4b8d-9dec-5d34c38c4a37/play_480p.mp4" },
    { "id": "v59", "title": "THE SHADOW GAME EP2", "category": "Thriller", "aspect": "landscape", "thumb": "/img/newlandscape/THE SHADOW GAME EP2.jpg", "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/1180b80a-fca0-402d-b86e-6c25988818ba/play_480p.mp4" },
    { "id": "v60", "title": "THE SHADOW GAME EP3", "category": "Mystery", "aspect": "landscape", "thumb": "/img/newlandscape/THE SHADOW GAME EP3.jpg", "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/463534cc-d355-4fe9-b6da-53277140f4cd/play_480p.mp4" },
    { "id": "v55", "title": "UNKNOWN ENEMY EP1", "category": "Thriller", "aspect": "landscape", "thumb": "/img/newlandscape/UNKNOWN ENEMY EP1.jpg", "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/0eacbf8f-3c0a-409b-8874-bb298c466933/play_480p.mp4" },
    { "id": "v56", "title": "UNKNOWN ENEMY EP2", "category": "Thriller", "aspect": "landscape", "thumb": "/img/newlandscape/UNKNOWN ENEMY EP2.jpg", "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/fc6a7905-ca95-44d9-a814-a101961bfb2b/play_480p.mp4" },
    { "id": "v57", "title": "UNKNOWN ENEMY EP3", "category": "Thriller", "aspect": "landscape", "thumb": "/img/newlandscape/UNKNOWN ENEMY EP3.jpg", "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/c4bcdd12-b1f3-4598-9ffc-b7072ac2d354/play_480p.mp4" },
    { "id": "v40", "title": "LAST MISSION ALIVE", "category": "Action", "aspect": "landscape", "thumb": "/img/newlandscape/LAST MISSION ALIVE.jpg", "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/a1d91030-cf54-420a-9b1c-4afe9ba19e15/play_480p.mp4" },
    { "id": "v73", "title": "HIDDEN FEAR EP1", "category": "Thriller", "aspect": "landscape", "thumb": "/img/newlandscape/HIDDEN FEAR EP1.jpg", "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/d72d661d-325f-4d19-b173-bf88746ddc7a/play_480p.mp4" }
  ],
  "codeRedLandscapeVideos": [
    { "id": "v87", "title": "CODE RED MAFIA", "category": "Crime", "aspect": "landscape", "thumb": "/img/newlandscape/CODE RED MAFIA.jpg", "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/29215cc6-4174-406b-a21d-71122bc7336a/play_480p.mp4" },
    { "id": "v15", "title": "ESCAPE FROM NOWHERE", "category": "Action", "aspect": "landscape", "thumb": "/img/newlandscape/ESCAPE FROM NOWHERE.jpg", "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/80d10199-16c3-433f-8802-de52a258588c/play_480p.mp4" },
    { "id": "v101", "title": "ADVENTURE BEYOND BORDERS", "category": "Adventure", "aspect": "landscape", "thumb": "/img/newlandscape/ADVENTURE BEYOND BORDERS.jpg", "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/6dfc4323-4ae3-428e-9866-13053dbd731c/play_480p.mp4" },
    { "id": "v96", "title": "THE LAST TRUTH EP1", "category": "Thriller", "aspect": "landscape", "thumb": "/img/newlandscape/THE LAST TRUTH EP1.jpg", "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/710a74b7-ec71-4504-abc9-d231aa23c2ec/play_480p.mp4" },
    { "id": "v97", "title": "THE LAST TRUTH EP2", "category": "Thriller", "aspect": "landscape", "thumb": "/img/newlandscape/THE LAST TRUTH EP2.jpg", "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/4851e395-3c41-44b6-a99a-06816305990e/play_480p.mp4" },
    { "id": "v98", "title": "CRIME SYNDICATE", "category": "Crime", "aspect": "landscape", "thumb": "/img/newlandscape/CRIME SYNDICATE.jpg", "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/f5cbe468-f999-49b6-9bc0-1bd9c4451d5e/play_480p.mp4" },
    { "id": "v11", "title": "FATAL CONNECTIONS EP1", "category": "Crime", "aspect": "landscape", "thumb": "/img/newlandscape/FATAL CONNECTIONS EP1.jpg", "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/2599bc17-5da5-4ebe-88c6-4e388cfb6e7a/play_480p.mp4" },
    { "id": "v13", "title": "FATAL CONNECTIONS EP3", "category": "Crime", "aspect": "landscape", "thumb": "/img/newlandscape/FATAL CONNECTIONS EP3.jpg", "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/e039a210-2833-4540-8ed2-882920df66ad/play_480p.mp4" },
    { "id": "t9", "title": "SCILENT TRIGGER", "category": "Action", "aspect": "landscape", "thumb": "/img/newlandscape/SCILENT TRIGGER.jpg", "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/5f4e3635-6eb7-4ad5-a2aa-400541d22e96/play_480p.mp4" },
    { "id": "v18", "title": "THE FINAL DHOKHA", "category": "Thriller", "aspect": "landscape", "thumb": "/img/newlandscape/THE FINAL DHOKHA.jpg", "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/890fe0ae-1956-4409-a9fe-635ff0c7a711/play_480p.mp4" }
  ],
  "escapeFearPortraitVideos": [
    { "id": "v47", "title": "ESCAPE BEYOND FEAR EP2", "category": "Thriller", "aspect": "portrait", "thumb": "/img/newportrait/ESCAPE BEYOND FEAR EP2.jpg", "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/e2c089c7-9466-462d-93c7-a72a539672b6/play_480p.mp4" },
    { "id": "v41", "title": "MIDNIGHT ESCAPE", "category": "Thriller", "aspect": "portrait", "thumb": "/img/newportrait/MIDNIGHT ESCAPE.jpg", "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/9ac5b5f9-d682-44a7-b877-772dec4b380d/play_480p.mp4" },
    { "id": "v43", "title": "HER STORY", "category": "Drama", "aspect": "portrait", "thumb": "/img/newportrait/HER STORY.jpg", "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/e8ad8fc4-49fa-43ab-9fda-36916e56d066/play_480p.mp4" },
    { "id": "v64", "title": "THE CRIME CIRCLE", "category": "Crime", "aspect": "portrait", "thumb": "/img/newportrait/THE CRIME CIRCLE.jpg", "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/912b01f0-6f55-491b-931d-7cda175785e2/play_480p.mp4" },
    { "id": "v28", "title": "DANGEROUS MINDS EP1", "category": "Thriller", "aspect": "portrait", "thumb": "/img/newportrait/DANGEROUS MINDS EP1.jpg", "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/da939e64-f3d5-495d-9c7a-6edb64925d1e/play_480p.mp4" },
    { "id": "v29", "title": "DANGEROUS MINDS EP2", "category": "Thriller", "aspect": "portrait", "thumb": "/img/newportrait/DANGEROUS MINDS EP2.jpg", "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/fd099482-0261-4b67-b760-f2cbcf8e06df/play_480p.mp4" },
    { "id": "v30", "title": "DANGEROUS MINDS EP3", "category": "Thriller", "aspect": "portrait", "thumb": "/img/newportrait/DANGEROUS MINDS EP3.jpg", "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/fd099482-0261-4b67-b760-f2cbcf8e06df/play_480p.mp4" },
    { "id": "v83", "title": "DANGEROUS DESTINATION EP2", "category": "Action", "aspect": "portrait", "thumb": "/img/newportrait/DANGEROUS DESTINATION EP2.jpg", "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/4527946b-8e26-4e53-87da-ab74f2313614/play_480p.mp4" }
  ],
  "chaseDangerLandscapeVideos": [
    { "id": "v91", "title": "CHASE TO DANGER EP1", "category": "Action", "aspect": "landscape", "thumb": "/img/newlandscape/CHASE TO DANGER EP1.jpg", "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/2ca7a8c9-3c22-40d7-9b8f-ad9c9be989cb/play_480p.mp4" },
    { "id": "v92", "title": "CHASE TO DANGER EP2", "category": "Action", "aspect": "landscape", "thumb": "/img/newlandscape/CHASE TO DANGER EP2.jpg", "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/671096db-84aa-4452-8298-d564b5fe5a41/play_480p.mp4" },
    { "id": "v93", "title": "CHASE TO DANGER EP3", "category": "Action", "aspect": "landscape", "thumb": "/img/newlandscape/CHASE TO DANGER EP3.jpg", "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/9d656763-670c-49e0-b721-ba6e9291b17b/play_480p.mp4" },
    { "id": "v94", "title": "CHASE TO DANGER EP4", "category": "Action", "aspect": "landscape", "thumb": "/img/newlandscape/CHASE TO DANGER EP4.jpg", "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/af763878-2990-48bd-83f1-b396dbce21f7/play_480p.mp4" },
    { "id": "v66", "title": "MISSSION DARKNIGHT", "category": "Action", "aspect": "landscape", "thumb": "/img/newlandscape/MISSSION DARKNIGHT.jpg", "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/639f02ab-e3db-434a-872a-72b38b4b277e/play_480p.mp4" },
    { "id": "v72", "title": "SILENT WITNESS", "category": "Mystery", "aspect": "landscape", "thumb": "/img/newlandscape/SILENT WITNESS.jpg", "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/a0f4772a-4376-44b1-a458-b50eff38a0e0/play_480p.mp4" },
    { "id": "v78", "title": "THE LAST CHANCE", "category": "Thriller", "aspect": "landscape", "thumb": "/img/newlandscape/THE LAST CHANCE.jpg", "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/20428f28-cc91-4463-bb07-df334be38ab3/play_480p.mp4" },
    { "id": "t3", "title": "SCILENT CHASE", "category": "Action", "aspect": "landscape", "thumb": "/img/newlandscape/SCILENT CHASE.jpg", "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/d6d3724c-e5fe-45bc-8a98-6a2c2f39d60b/play_480p.mp4" },
    { "id": "v54", "title": "WANTED BY DARKNESS", "category": "Crime", "aspect": "landscape", "thumb": "/img/newlandscape/WANTED BY DARKNESS.jpg", "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/153805c9-a16e-48fc-8bdd-e33db79cb737/play_480p.mp4" },
    { "id": "v39", "title": "WANTED FOR REVENGE", "category": "Action", "aspect": "landscape", "thumb": "/img/newlandscape/WANTED FOR REVENGE.jpg", "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/8a65b7aa-fa05-4a1e-9d25-3d34a0af19b5/play_480p.mp4" }
  ],
  "junctionVideos": [
    { "id": "v88", "title": "BLACKMAIL JUNCTION", "category": "Crime", "aspect": "portrait", "thumb": "p88.png", "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/40448adf-7577-4a1b-8bbb-0c0e1dedbb46/play_480p.mp4" },
    { "id": "v69", "title": "ESCAPE ROUT 21", "category": "Action", "aspect": "portrait", "thumb": "p69.png", "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/95e1a708-9d85-476c-83cd-a0f656f46dd4/play_480p.mp4" },
    { "id": "v67", "title": "ADVENTURE KE RAAZ", "category": "Adventure", "aspect": "portrait", "thumb": "p67.png", "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/919cb0e1-f1dc-40f5-8698-59bdfa0d2fd4/play_480p.mp4" },
    { "id": "v65", "title": "SECRET NIGHTS", "category": "Thriller", "aspect": "portrait", "thumb": "p65.png", "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/8b2ccb4d-032d-4671-b3fe-7459f7bf6e4c/play_480p.mp4" },
    { "id": "v54", "title": "WANTED BY DARKNESS", "category": "Crime", "aspect": "portrait", "thumb": "p54.png", "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/153805c9-a16e-48fc-8bdd-e33db79cb737/play_480p.mp4" },
    { "id": "v51", "title": "MYSTERY JUNCTION", "category": "Mystery", "aspect": "portrait", "thumb": "p51.png", "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/28e8218c-9ab8-43d9-a375-c8911de661fd/play_480p.mp4" },
    { "id": "v49", "title": "UNDERGROUND WARRIORS EP1", "category": "Action", "aspect": "portrait", "thumb": "p49.png", "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/f614d9ea-0e47-4fd0-97ec-45b26b6eac42/play_480p.mp4" },
    { "id": "v50", "title": "UNDERGROUND WARRIORS EP2", "category": "Action", "aspect": "portrait", "thumb": "p50.png", "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/30f1099b-78b3-43e8-ae24-72ba766b57e6/play_480p.mp4" }
  ],
  "networkVideos": [
    { "id": "v61", "title": "THE SHADOW GAME EP4", "category": "Thriller", "aspect": "landscape", "thumb": "l61.png", "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/8c586fdf-c6b1-4dec-83b2-a700c2ae3c1a/play_480p.mp4" },
    { "id": "v59", "title": "THE SHADOW GAME EP2", "category": "Thriller", "aspect": "landscape", "thumb": "l59.png", "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/1180b80a-fca0-402d-b86e-6c25988818ba/play_480p.mp4" },
    { "id": "v58", "title": "THE SHADOW GAME EP1", "category": "Thriller", "aspect": "landscape", "thumb": "l58.png", "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/5cd8a869-e025-4b8d-9dec-5d34c38c4a37/play_480p.mp4" },
    { "id": "v39", "title": "WANTED FOR REVENGE", "category": "Action", "aspect": "landscape", "thumb": "l39.png", "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/8a65b7aa-fa05-4a1e-9d25-3d34a0af19b5/play_480p.mp4" },
    { "id": "v44", "title": "DANGEROUS TERRITORY", "category": "Action", "aspect": "landscape", "thumb": "l44.png", "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/89953c37-edf9-4b6d-85eb-eeb8251f4818/play_480p.mp4" },
    { "id": "v36", "title": "THE SECRET MISSION", "category": "Action", "aspect": "landscape", "thumb": "l36.png", "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/71121b34-eb1f-4a5d-984a-e1661e402d2d/play_480p.mp4" },
    { "id": "v35", "title": "THE DARK NETWORK", "category": "Crime", "aspect": "landscape", "thumb": "l35.png", "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/a9c3c48b-795d-400d-9483-40f612740a21/play_480p.mp4" },
    { "id": "v71", "title": "ROGUE NATION", "category": "Action", "aspect": "landscape", "thumb": "l71.png", "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/914c52d0-5a98-43f5-992a-beaddefb5ab1/play_480p.mp4" }
  ],
  "mindsVideos": [
    { "id": "v30", "title": "DANGEROUS MINDS EP3", "category": "Thriller", "aspect": "portrait", "thumb": "p30.png", "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/fd099482-0261-4b67-b760-f2cbcf8e06df/play_480p.mp4" },
    { "id": "v34", "title": "FINAL COUNTDOWN", "category": "Action", "aspect": "portrait", "thumb": "p34.png", "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/3514fd24-dc36-41f6-92ee-d0c151f16021/play_480p.mp4" },
    { "id": "v28", "title": "DANGEROUS MINDS EP1", "category": "Thriller", "aspect": "portrait", "thumb": "p28.png", "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/da939e64-f3d5-495d-9c7a-6edb64925d1e/play_480p.mp4" },
    { "id": "v29", "title": "DANGEROUS MINDS EP2", "category": "Thriller", "aspect": "portrait", "thumb": "p29.png", "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/fd099482-0261-4b67-b760-f2cbcf8e06df/play_480p.mp4" },
    { "id": "v21", "title": "FINAL WITNESS", "category": "Mystery", "aspect": "portrait", "thumb": "p21.png", "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/a74bf4eb-3380-4b9b-b091-9ec09acbd22d/play_480p.mp4" },
    { "id": "v25", "title": "ESCAPE PLAN 302", "category": "Action", "aspect": "portrait", "thumb": "p25.png", "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/eeb54276-c87d-418e-b19c-0dcf00dad105/play_480p.mp4" },
    { "id": "v23", "title": "DEAD END MISSON", "category": "Action", "aspect": "portrait", "thumb": "p23.png", "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/77627729-6d06-45f5-9f26-c5362bf33fc2/play_480p.mp4" },
    { "id": "v18", "title": "THE FINAL DHOKHA", "category": "Thriller", "aspect": "portrait", "thumb": "p18.png", "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/890fe0ae-1956-4409-a9fe-635ff0c7a711/play_480p.mp4" }
  ],
  "classicsVideos": [
    { "id": "t1", "title": "RAAZ BEYOND FEAR", "category": "Thriller", "aspect": "landscape", "thumb": "l1.png", "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/7a4a75b5-c88f-42cf-9bf6-219479cd05e5/play_480p.mp4" },
    { "id": "t2", "title": "THE HIDDEN TRUTH", "category": "Thriller", "aspect": "landscape", "thumb": "l2.png", "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/4a7b3bca-46b6-4ea8-88ed-03b374b4664f/play_480p.mp4" },
    { "id": "t3", "title": "SCILENT CHASE", "category": "Action", "aspect": "landscape", "thumb": "l3.png", "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/d6d3724c-e5fe-45bc-8a98-6a2c2f39d60b/play_480p.mp4" },
    { "id": "t4", "title": "THE MISSING WITNESS", "category": "Mystery", "aspect": "landscape", "thumb": "l4.png", "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/af831cce-bcaf-4631-9817-e835f5f0d5db/play_480p.mp4" },
    { "id": "t5", "title": "THE SECRET ROUT EP1", "category": "Drama", "aspect": "landscape", "thumb": "l5.png", "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/51f664a4-dfe0-46b7-be10-e3ed819c3ec1/play_480p.mp4" },
    { "id": "t6", "title": "THE SECRET ROUT EP2", "category": "Drama", "aspect": "landscape", "thumb": "l6.png", "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/6bf9873a-bbdb-4253-a0b8-3ce37b046c87/play_480p.mp4" },
    { "id": "t7", "title": "RAAZ, REVENGE & MAFIA EP1", "category": "Crime", "aspect": "landscape", "thumb": "l7.png", "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/28547fd1-f01a-4b0b-9b68-0729d2a8e8c2/play_480p.mp4" },
    { "id": "t8", "title": "RAAZ, REVENGE & MAFIA EP2", "category": "Crime", "aspect": "landscape", "thumb": "l8.png", "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/f4ad3455-6bfc-4436-8d0d-543d1eec8d28/play_480p.mp4" }
  ],
  "finaleVideos": [
    { "id": "t9", "title": "SCILENT TRIGGER", "category": "Action", "aspect": "portrait", "thumb": "p9.png", "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/5f4e3635-6eb7-4ad5-a2aa-400541d22e96/play_480p.mp4" },
    { "id": "v17", "title": "THE SECRET ORDER", "category": "Thriller", "aspect": "portrait", "thumb": "p17.png", "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/397c0570-5de5-4bd3-9a4b-c4063c2e977c/play_480p.mp4" },
    { "id": "v12", "title": "FATAL CONNECTIONS EP2", "category": "Crime", "aspect": "portrait", "thumb": "p12.png", "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/c82bbf6f-2701-41ec-bf2a-56c1661ed780/play_480p.mp4" },
    { "id": "v103", "title": "MUCK ENGLISH WITH SU", "category": "Drama", "aspect": "portrait", "thumb": "p103.png", "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/2795a481-8756-4f0e-9183-25cc35c85daf/play_480p.mp4" },
    { "id": "v104", "title": "KILL-HER-GOATS", "category": "Thriller", "aspect": "portrait", "thumb": "p104.png", "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/d40f15c2-9c38-4d04-a08a-47dea08151bc/play_480p.mp4" },
    { "id": "v101", "title": "ADVENTURE BEYOND BORDERS", "category": "Adventure", "aspect": "portrait", "thumb": "p101.png", "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/6dfc4323-4ae3-428e-9866-13053dbd731c/play_480p.mp4" }
  ],
  "allVideos": [
    {
      "id": "t1",
      "title": "Raaz Beyond Fear",
      "category": "Thriller",
      "aspect": "landscape",
      "thumb": "l1.png",
      "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/7a4a75b5-c88f-42cf-9bf6-219479cd05e5/play_480p.mp4"
    },
    {
      "id": "t2",
      "title": "The Hidden Truth",
      "category": "Thriller",
      "aspect": "landscape",
      "thumb": "l2.png",
      "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/4a7b3bca-46b6-4ea8-88ed-03b374b4664f/play_480p.mp4"
    },
    {
      "id": "t3",
      "title": "Silent Chase",
      "category": "Action",
      "aspect": "landscape",
      "thumb": "l3.png",
      "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/d6d3724c-e5fe-45bc-8a98-6a2c2f39d60b/play_480p.mp4"
    },
    {
      "id": "t4",
      "title": "The Missing Witness",
      "category": "Mystery",
      "aspect": "landscape",
      "thumb": "l4.png",
      "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/af831cce-bcaf-4631-9817-e835f5f0d5db/play_480p.mp4"
    },
    {
      "id": "t5",
      "title": "The Secret Route Ep 1",
      "category": "Drama",
      "aspect": "landscape",
      "thumb": "l5.png",
      "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/51f664a4-dfe0-46b7-be10-e3ed819c3ec1/play_480p.mp4"
    },
    {
      "id": "t6",
      "title": "The Secret Route Ep 2",
      "category": "Drama",
      "aspect": "landscape",
      "thumb": "l6.png",
      "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/6bf9873a-bbdb-4253-a0b8-3ce37b046c87/play_480p.mp4"
    },
    {
      "id": "t7",
      "title": "Raaz, Revenge & Mafia Ep1",
      "category": "Crime",
      "aspect": "landscape",
      "thumb": "l7.png",
      "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/28547fd1-f01a-4b0b-9b68-0729d2a8e8c2/play_480p.mp4"
    },
    {
      "id": "t8",
      "title": "Raaz, Revenge & Mafia Ep2",
      "category": "Crime",
      "aspect": "landscape",
      "thumb": "l8.png",
      "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/f4ad3455-6bfc-4436-8d0d-543d1eec8d28/play_480p.mp4"
    },
    {
      "id": "t9",
      "title": "Silent Trigger",
      "category": "Action",
      "aspect": "landscape",
      "thumb": "l9.png",
      "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/5f4e3635-6eb7-4ad5-a2aa-400541d22e96/play_480p.mp4"
    },
    {
      "id": "t10",
      "title": "The Forbidden Files",
      "category": "Mystery",
      "aspect": "landscape",
      "thumb": "l10.png",
      "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/85f84324-4088-4cc8-8ea2-ca99cb7bc568/play_480p.mp4"
    },
    {
      "id": "v11",
      "title": "FATAL CONNECTIONS EP1",
      "category": "Thriller",
      "aspect": "landscape",
      "thumb": "l11.png",
      "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/2599bc17-5da5-4ebe-88c6-4e388cfb6e7a/play_480p.mp4"
    },
    {
      "id": "v12",
      "title": "FATAL CONNECTIONS EP2",
      "category": "Thriller",
      "aspect": "landscape",
      "thumb": "l12.png",
      "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/c82bbf6f-2701-41ec-bf2a-56c1661ed780/play_480p.mp4"
    },
    {
      "id": "v13",
      "title": "FATAL CONNECTIONS EP3",
      "category": "Thriller",
      "aspect": "landscape",
      "thumb": "l13.png",
      "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/e039a210-2833-4540-8ed2-882920df66ad/play_480p.mp4"
    },
    {
      "id": "v14",
      "title": "THE HIDDEN ENEMY",
      "category": "Thriller",
      "aspect": "landscape",
      "thumb": "l14.png",
      "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/47557aed-0f85-45cf-a818-19fd88a2b8de/play_480p.mp4"
    },
    {
      "id": "v15",
      "title": "ESCAPE FROM NOWHERE",
      "category": "Action",
      "aspect": "landscape",
      "thumb": "l15.png",
      "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/80d10199-16c3-433f-8802-de52a258588c/play_480p.mp4"
    },
    {
      "id": "v16",
      "title": "THE FINAL SECRET",
      "category": "Mystery",
      "aspect": "landscape",
      "thumb": "l16.png",
      "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/3ed4455a-3408-42e9-bf9a-5f45d616ad76/play_480p.mp4"
    },
    {
      "id": "v17",
      "title": "THE SECRET ORDER",
      "category": "Thriller",
      "aspect": "landscape",
      "thumb": "l17.png",
      "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/397c0570-5de5-4bd3-9a4b-c4063c2e977c/play_480p.mp4"
    },
    {
      "id": "v18",
      "title": "THE FINAL DHOKHA",
      "category": "Drama",
      "aspect": "landscape",
      "thumb": "l18.png",
      "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/890fe0ae-1956-4409-a9fe-635ff0c7a711/play_480p.mp4"
    },
    {
      "id": "v20",
      "title": "BLACK DIARY SECRETS EP2",
      "category": "Mystery",
      "aspect": "landscape",
      "thumb": "l20.png",
      "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/34f1001c-5f45-4a80-8a76-a2bee40bb09a/play_480p.mp4"
    },
    {
      "id": "v21",
      "title": "FINAL WITNESS",
      "category": "Thriller",
      "aspect": "portrait",
      "thumb": "p21.png",
      "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/a74bf4eb-3380-4b9b-b091-9ec09acbd22d/play_480p.mp4"
    },
    {
      "id": "v22",
      "title": "THE MISSING LINK",
      "category": "Mystery",
      "aspect": "portrait",
      "thumb": "p22.png",
      "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/11444673-b5cf-43a1-a6fa-7cc8e4552e96/play_480p.mp4"
    },
    {
      "id": "v23",
      "title": "DEAD END MISSON",
      "category": "Action",
      "aspect": "portrait",
      "thumb": "p23.png",
      "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/77627729-6d06-45f5-9f26-c5362bf33fc2/play_480p.mp4"
    },
    {
      "id": "v24",
      "title": "DANGEROUS ALLIANCE",
      "category": "Thriller",
      "aspect": "portrait",
      "thumb": "p24.png",
      "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/84b04739-d8f4-4a60-9a0c-1956fc0c562d/play_480p.mp4"
    },
    {
      "id": "v25",
      "title": "ESCAPE PLAN 302",
      "category": "Action",
      "aspect": "portrait",
      "thumb": "p25.png",
      "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/eeb54276-c87d-418e-b19c-0dcf00dad105/play_480p.mp4"
    },
    {
      "id": "v27",
      "title": "OPERATION NIGHTFALL",
      "category": "Thriller",
      "aspect": "portrait",
      "thumb": "p27.png",
      "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/28d84155-2e99-4633-833d-01bfb7187dd3/play_480p.mp4"
    },
    {
      "id": "v28",
      "title": "DANGEROUS MINDS EP1",
      "category": "Drama",
      "aspect": "portrait",
      "thumb": "p28.png",
      "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/da939e64-f3d5-495d-9c7a-6edb64925d1e/play_480p.mp4"
    },
    {
      "id": "v29",
      "title": "DANGEROUS MINDS EP2",
      "category": "Drama",
      "aspect": "portrait",
      "thumb": "p29.png",
      "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/fd099482-0261-4b67-b760-f2cbcf8e06df/play_480p.mp4"
    },
    {
      "id": "v30",
      "title": "DANGEROUS MINDS EP3",
      "category": "Drama",
      "aspect": "portrait",
      "thumb": "p30.png",
      "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/fd099482-0261-4b67-b760-f2cbcf8e06df/play_480p.mp4"
    },
    {
      "id": "v31",
      "title": "DANGEROUS MINDS EP4",
      "category": "Drama",
      "aspect": "landscape",
      "thumb": "l31.png",
      "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/fb60c689-0ae6-4d37-9e7a-0a6fd490aef0/play_480p.mp4"
    },
    {
      "id": "v34",
      "title": "FINAL COUNTDOWN",
      "category": "Action",
      "aspect": "landscape",
      "thumb": "l34.png",
      "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/3514fd24-dc36-41f6-92ee-d0c151f16021/play_480p.mp4"
    },
    {
      "id": "v35",
      "title": "THE DARK NETWORK",
      "category": "Crime",
      "aspect": "landscape",
      "thumb": "l35.png",
      "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/a9c3c48b-795d-400d-9483-40f612740a21/play_480p.mp4"
    },
    {
      "id": "v36",
      "title": "THE SECRET MISSION",
      "category": "Action",
      "aspect": "landscape",
      "thumb": "l36.png",
      "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/71121b34-eb1f-4a5d-984a-e1661e402d2d/play_480p.mp4"
    },
    {
      "id": "v37",
      "title": "THE SECRET SYNDICATE",
      "category": "Crime",
      "aspect": "landscape",
      "thumb": "l37.png",
      "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/6cffca6b-7759-40e7-84de-c97856b4c7be/play_480p.mp4"
    },
    {
      "id": "v38",
      "title": "THE UNKNOWN TARGET",
      "category": "Thriller",
      "aspect": "landscape",
      "thumb": "l38.png",
      "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/cb6cdbd5-e1d3-470c-ab5c-a7e8bcb58945/play_480p.mp4"
    },
    {
      "id": "v39",
      "title": "WANTED FOR REVENGE",
      "category": "Action",
      "aspect": "landscape",
      "thumb": "l39.png",
      "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/8a65b7aa-fa05-4a1e-9d25-3d34a0af19b5/play_480p.mp4"
    },
    {
      "id": "v40",
      "title": "LAST MISSION ALIVE",
      "category": "Thriller",
      "aspect": "landscape",
      "thumb": "l40.png",
      "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/a1d91030-cf54-420a-9b1c-4afe9ba19e15/play_480p.mp4"
    },
    {
      "id": "v41",
      "title": "MIDNIGHT ESCAPE",
      "category": "Thriller",
      "aspect": "portrait",
      "thumb": "p41.png",
      "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/9ac5b5f9-d682-44a7-b877-772dec4b380d/play_480p.mp4"
    },
    {
      "id": "v42",
      "title": "THE DIARY SECRETS",
      "category": "Mystery",
      "aspect": "portrait",
      "thumb": "p42.png",
      "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/d1f6716d-b7b1-41c3-8e4a-fd7204a75a74/play_480p.mp4"
    },
    {
      "id": "v43",
      "title": "HER STORY",
      "category": "Drama",
      "aspect": "portrait",
      "thumb": "p43.png",
      "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/e8ad8fc4-49fa-43ab-9fda-36916e56d066/play_480p.mp4"
    },
    {
      "id": "v44",
      "title": "DANGEROUS TERRITORY",
      "category": "Action",
      "aspect": "portrait",
      "thumb": "p44.png",
      "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/89953c37-edf9-4b6d-85eb-eeb8251f4818/play_480p.mp4"
    },
    {
      "id": "v45",
      "title": "SHADOW PROTOCOL",
      "category": "Thriller",
      "aspect": "portrait",
      "thumb": "p45.png",
      "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/08ebb0ad-11cd-458a-823b-3e19382347aa/play_480p.mp4"
    },
    {
      "id": "v47",
      "title": "ESCAPE BEYOND FEAR EP2",
      "category": "Thriller",
      "aspect": "portrait",
      "thumb": "p47.png",
      "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/e2c089c7-9466-462d-93c7-a72a539672b6/play_480p.mp4"
    },
    {
      "id": "v49",
      "title": "UNDERGROUND WARRIORS EP1",
      "category": "Action",
      "aspect": "portrait",
      "thumb": "p49.png",
      "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/f614d9ea-0e47-4fd0-97ec-45b26b6eac42/play_480p.mp4"
    },
    {
      "id": "v50",
      "title": "UNDERGROUND WARRIORS EP2",
      "category": "Action",
      "aspect": "portrait",
      "thumb": "p50.png",
      "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/30f1099b-78b3-43e8-ae24-72ba766b57e6/play_480p.mp4"
    },
    {
      "id": "v51",
      "title": "MYSTERY JUNCTION",
      "category": "Mystery",
      "aspect": "landscape",
      "thumb": "l51.png",
      "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/28e8218c-9ab8-43d9-a375-c8911de661fd/play_480p.mp4"
    },
    {
      "id": "v52",
      "title": "DARK CITY FILES",
      "category": "Crime",
      "aspect": "landscape",
      "thumb": "l52.png",
      "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/64ef26c1-c28b-4cd4-926e-7f878f62e2c1/play_480p.mp4"
    },
    {
      "id": "v54",
      "title": "WANTED BY DARKNESS",
      "category": "Thriller",
      "aspect": "landscape",
      "thumb": "l54.png",
      "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/153805c9-a16e-48fc-8bdd-e33db79cb737/play_480p.mp4"
    },
    {
      "id": "v55",
      "title": "UNKNOWN ENEMY EP1",
      "category": "Thriller",
      "aspect": "landscape",
      "thumb": "l55.png",
      "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/0eacbf8f-3c0a-409b-8874-bb298c466933/play_480p.mp4"
    },
    {
      "id": "v56",
      "title": "UNKNOWN ENEMY EP2",
      "category": "Thriller",
      "aspect": "landscape",
      "thumb": "l56.png",
      "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/fc6a7905-ca95-44d9-a814-a101961bfb2b/play_480p.mp4"
    },
    {
      "id": "v57",
      "title": "UNKNOWN ENEMY EP3",
      "category": "Thriller",
      "aspect": "landscape",
      "thumb": "l57.png",
      "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/c4bcdd12-b1f3-4598-9ffc-b7072ac2d354/play_480p.mp4"
    },
    {
      "id": "v58",
      "title": "THE SHADOW GAME EP1",
      "category": "Mystery",
      "aspect": "landscape",
      "thumb": "l58.png",
      "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/5cd8a869-e025-4b8d-9dec-5d34c38c4a37/play_480p.mp4"
    },
    {
      "id": "v59",
      "title": "THE SHADOW GAME EP2",
      "category": "Mystery",
      "aspect": "landscape",
      "thumb": "l59.png",
      "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/1180b80a-fca0-402d-b86e-6c25988818ba/play_480p.mp4"
    },
    {
      "id": "v60",
      "title": "THE SHADOW GAME EP3",
      "category": "Mystery",
      "aspect": "landscape",
      "thumb": "l60.png",
      "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/463534cc-d355-4fe9-b6da-53277140f4cd/play_480p.mp4"
    },
    {
      "id": "v61",
      "title": "THE SHADOW GAME EP4",
      "category": "Mystery",
      "aspect": "portrait",
      "thumb": "p61.png",
      "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/8c586fdf-c6b1-4dec-83b2-a700c2ae3c1a/play_480p.mp4"
    },
    {
      "id": "v62",
      "title": "THE FITNESS TRAP",
      "category": "Thriller",
      "aspect": "portrait",
      "thumb": "p62.png",
      "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/a74bbde6-2f05-49b7-88b5-68ad82b4186c/play_480p.mp4"
    },
    {
      "id": "v64",
      "title": "THE CRIME CIRCLE",
      "category": "Crime",
      "aspect": "portrait",
      "thumb": "p64.png",
      "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/912b01f0-6f55-491b-931d-7cda175785e2/play_480p.mp4"
    },
    {
      "id": "v65",
      "title": "SECRET NIGHTS",
      "category": "Drama",
      "aspect": "portrait",
      "thumb": "p65.png",
      "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/8b2ccb4d-032d-4671-b3fe-7459f7bf6e4c/play_480p.mp4"
    },
    {
      "id": "v66",
      "title": "MISSSION DARKNIGHT",
      "category": "Action",
      "aspect": "portrait",
      "thumb": "p66.png",
      "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/639f02ab-e3db-434a-872a-72b38b4b277e/play_480p.mp4"
    },
    {
      "id": "v67",
      "title": "ADVENTURE KE RAAZ",
      "category": "Adventure",
      "aspect": "portrait",
      "thumb": "p67.png",
      "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/919cb0e1-f1dc-40f5-8698-59bdfa0d2fd4/play_480p.mp4"
    },
    {
      "id": "v68",
      "title": "KILLER INSTINCT",
      "category": "Thriller",
      "aspect": "portrait",
      "thumb": "p68.png",
      "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/b920eca1-3a4a-4fce-bebd-0a9d2633e4f3/play_480p.mp4"
    },
    {
      "id": "v69",
      "title": "ESCAPE ROUT 21",
      "category": "Action",
      "aspect": "portrait",
      "thumb": "p69.png",
      "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/95e1a708-9d85-476c-83cd-a0f656f46dd4/play_480p.mp4"
    },
    {
      "id": "v70",
      "title": "BLACK SIGNAL",
      "category": "Thriller",
      "aspect": "portrait",
      "thumb": "p70.png",
      "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/f5c0b07d-5a7f-4df6-b906-1f7a2f0cef76/play_480p.mp4"
    },
    {
      "id": "v71",
      "title": "ROGUE NATION",
      "category": "Action",
      "aspect": "landscape",
      "thumb": "l71.png",
      "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/914c52d0-5a98-43f5-992a-beaddefb5ab1/play_480p.mp4"
    },
    {
      "id": "v72",
      "title": "SILENT WITNESS",
      "category": "Thriller",
      "aspect": "landscape",
      "thumb": "l72.png",
      "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/a0f4772a-4376-44b1-a458-b50eff38a0e0/play_480p.mp4"
    },
    {
      "id": "v73",
      "title": "HIDDEN FEAR EP1",
      "category": "Thriller",
      "aspect": "landscape",
      "thumb": "l73.png",
      "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/d72d661d-325f-4d19-b173-bf88746ddc7a/play_480p.mp4"
    },
    {
      "id": "v74",
      "title": "HIDDEN FEAR EP2",
      "category": "Thriller",
      "aspect": "landscape",
      "thumb": "l74.png",
      "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/df61e791-f5e0-48cd-bfbb-49c5afbd2b84/play_480p.mp4"
    },
    {
      "id": "v75",
      "title": "HIDDEN FEAR EP3",
      "category": "Thriller",
      "aspect": "landscape",
      "thumb": "l75.png",
      "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/cf401e32-06ee-4fe9-a6eb-53fe6e441d72/play_480p.mp4"
    },
    {
      "id": "v76",
      "title": "HIDDEN FEAR EP4",
      "category": "Thriller",
      "aspect": "landscape",
      "thumb": "l76.png",
      "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/311aa2ba-164c-41b8-b9d1-910063c83d5d/play_480p.mp4"
    },
    {
      "id": "v77",
      "title": "THE SILENT HUNT",
      "category": "Mystery",
      "aspect": "landscape",
      "thumb": "l77.png",
      "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/4941972e-1692-4d0b-ab19-28887a806631/play_480p.mp4"
    },
    {
      "id": "v78",
      "title": "THE LAST CHANCE",
      "category": "Drama",
      "aspect": "landscape",
      "thumb": "l78.png",
      "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/20428f28-cc91-4463-bb07-df334be38ab3/play_480p.mp4"
    },
    {
      "id": "v79",
      "title": "SHADOW FORCE",
      "category": "Action",
      "aspect": "landscape",
      "thumb": "l79.png",
      "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/86344b4d-c5c0-42cd-8d51-2ea14e6215ad/play_480p.mp4"
    },
    {
      "id": "v82",
      "title": "DANGEROUS DESTINATION EP1",
      "category": "Thriller",
      "aspect": "portrait",
      "thumb": "p82.png",
      "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/6e1962ba-dbcc-4c2b-963a-d3176124deb4/play_480p.mp4"
    },
    {
      "id": "v83",
      "title": "DANGEROUS DESTINATION EP2",
      "category": "Thriller",
      "aspect": "portrait",
      "thumb": "p83.png",
      "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/4527946b-8e26-4e53-87da-ab74f2313614/play_480p.mp4"
    },
    {
      "id": "v84",
      "title": "DANGEROUS DESTINATION EP3",
      "category": "Thriller",
      "aspect": "portrait",
      "thumb": "p84.png",
      "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/613259cb-60be-4296-96ca-63ebc21922c0/play_480p.mp4"
    },
    {
      "id": "v85",
      "title": "DANGEROUS DESTINATION EP4",
      "category": "Thriller",
      "aspect": "portrait",
      "thumb": "p85.png",
      "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/2c902c65-1f63-4855-be88-cee69e2ac9a0/play_480p.mp4"
    },
    {
      "id": "v86",
      "title": "KILLER WALI RAAT",
      "category": "Thriller",
      "aspect": "portrait",
      "thumb": "p86.png",
      "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/436a5e04-04b6-4bcc-bd2d-c54939083b0c/play_480p.mp4"
    },
    {
      "id": "v87",
      "title": "CODE RED MAFIA",
      "category": "Crime",
      "aspect": "portrait",
      "thumb": "p87.png",
      "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/29215cc6-4174-406b-a21d-71122bc7336a/play_480p.mp4"
    },
    {
      "id": "v88",
      "title": "BLACKMAIL JUNCTION",
      "category": "Crime",
      "aspect": "portrait",
      "thumb": "p88.png",
      "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/40448adf-7577-4a1b-8bbb-0c0e1dedbb46/play_480p.mp4"
    },
    {
      "id": "v89",
      "title": "THE UNOFFICIAL NETWORK",
      "category": "Thriller",
      "aspect": "portrait",
      "thumb": "p89.png",
      "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/a90c6024-768c-4c24-87d4-07612b07477a/play_480p.mp4"
    },
    {
      "id": "v91",
      "title": "CHASE TO DANGER EP1",
      "category": "Action",
      "aspect": "landscape",
      "thumb": "l91.png",
      "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/2ca7a8c9-3c22-40d7-9b8f-ad9c9be989cb/play_480p.mp4"
    },
    {
      "id": "v92",
      "title": "CHASE TO DANGER EP2",
      "category": "Action",
      "aspect": "landscape",
      "thumb": "l92.png",
      "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/671096db-84aa-4452-8298-d564b5fe5a41/play_480p.mp4"
    },
    {
      "id": "v93",
      "title": "CHASE TO DANGER EP3",
      "category": "Action",
      "aspect": "landscape",
      "thumb": "l93.png",
      "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/9d656763-670c-49e0-b721-ba6e9291b17b/play_480p.mp4"
    },
    {
      "id": "v94",
      "title": "CHASE TO DANGER EP4",
      "category": "Action",
      "aspect": "landscape",
      "thumb": "l94.png",
      "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/af763878-2990-48bd-83f1-b396dbce21f7/play_480p.mp4"
    },
    {
      "id": "v96",
      "title": "THE LAST TRUTH EP1",
      "category": "Drama",
      "aspect": "landscape",
      "thumb": "l96.png",
      "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/710a74b7-ec71-4504-abc9-d231aa23c2ec/play_480p.mp4"
    },
    {
      "id": "v97",
      "title": "THE LAST TRUTH EP2",
      "category": "Drama",
      "aspect": "landscape",
      "thumb": "l97.png",
      "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/4851e395-3c41-44b6-a99a-06816305990e/play_480p.mp4"
    },
    {
      "id": "v98",
      "title": "CRIME SYNDICATE",
      "category": "Crime",
      "aspect": "landscape",
      "thumb": "l98.png",
      "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/f5cbe468-f999-49b6-9bc0-1bd9c4451d5e/play_480p.mp4"
    },
    {
      "id": "v99",
      "title": "BLACK HORIZON",
      "category": "Thriller",
      "aspect": "landscape",
      "thumb": "l99.png",
      "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/716f0c5e-3509-4f1c-84e6-f5838a0300b5/play_480p.mp4"
    },
    {
      "id": "v100",
      "title": "DARK EMPIRE",
      "category": "Crime",
      "aspect": "landscape",
      "thumb": "l100.png",
      "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/2c0ea145-e0d1-44a9-8a3b-b3a40b01f11a/play_480p.mp4"
    },
    {
      "id": "v101",
      "title": "ADVENTURE BEYOND BORDERS",
      "category": "Adventure",
      "aspect": "landscape",
      "thumb": "l101.png",
      "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/6dfc4323-4ae3-428e-9866-13053dbd731c/play_480p.mp4"
    },
    {
      "id": "v102",
      "title": "MIDNIGHT CASE",
      "category": "Mystery",
      "aspect": "landscape",
      "thumb": "l102.png",
      "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/cdb7b936-b110-48c7-acaa-a5bad2fc57bd/play_480p.mp4"
    },
    {
      "id": "v103",
      "title": "MUCK ENGLISH WITH SU",
      "category": "Drama",
      "aspect": "portrait",
      "thumb": "p103.png",
      "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/2795a481-8756-4f0e-9183-25cc35c85daf/play_480p.mp4"
    },
    {
      "id": "v104",
      "title": "KILL-HER-GOATS",
      "category": "Thriller",
      "aspect": "portrait",
      "thumb": "p104.png",
      "videoUrl": "https://vz-012bcd01-e4e.b-cdn.net/d40f15c2-9c38-4d04-a08a-47dea08151bc/play_480p.mp4"
    }
  ],
  "homeSections": [
    {
      "id": "midnight",
      "title": "Midnight Premieres",
      "subtitle": "New crime thrillers ready to watch",
      "videosKey": "midnightVideos",
      "layout": "grid2x5"
    },
    {
      "id": "portrait-grid",
      "title": "Hidden Fear",
      "subtitle": "Landscape picks - fear, escape, and shadow games",
      "videosKey": "portraitGridVideos",
      "layout": "grid2x5"
    },
    {
      "id": "wanted-landscape",
      "title": "Wanted & Underground",
      "subtitle": "Portrait picks - shadow games and revenge",
      "videosKey": "wantedLandscapeVideos",
      "layout": "grid2x4"
    },
    {
      "id": "dark-minds-grid",
      "title": "Dangerous Minds",
      "subtitle": "Landscape picks - missions, minds, and final stakes",
      "videosKey": "darkMindsPortraitVideos",
      "layout": "grid2x5"
    },
    {
      "id": "final-strike-grid",
      "title": "Final Strike",
      "subtitle": "Portrait picks - escape, revenge, and raaz",
      "videosKey": "finalStrikePortraitVideos",
      "layout": "grid2x4"
    },
    {
      "id": "secret-route",
      "title": "Secret Route",
      "subtitle": "Portrait picks - routes, fear, and fatal links",
      "videosKey": "secretRouteLandscapeVideos",
      "layout": "grid2x4"
    },
    {
      "id": "after-device",
      "title": "Black Diary Secrets",
      "subtitle": "Landscape picks - secrets, missions, and targets",
      "videosKey": "afterDeviceLandscapeVideos",
      "layout": "grid2x5"
    },
    {
      "id": "shadow-hunt",
      "title": "Shadow Hunt",
      "subtitle": "Landscape picks - targets, fear, and crimewave",
      "videosKey": "shadowHuntLandscapeVideos",
      "layout": "grid2x5"
    },
    {
      "id": "code-red",
      "title": "Code Red",
      "subtitle": "Landscape picks - destinations, mafia, and escape",
      "videosKey": "codeRedLandscapeVideos",
      "layout": "grid2x5"
    },
    {
      "id": "escape-fear",
      "title": "Escape Beyond Fear",
      "subtitle": "Portrait picks - suspicion, escape, and last deals",
      "videosKey": "escapeFearPortraitVideos",
      "layout": "grid2x4"
    },
    {
      "id": "chase-danger",
      "title": "Chase to Danger",
      "subtitle": "Landscape picks - missions, witnesses, and chase",
      "videosKey": "chaseDangerLandscapeVideos",
      "layout": "grid2x5"
    },
    {
      "id": "trending",
      "title": "Crime & Mystery Originals",
      "subtitle": "Thrilling investigations and dark secrets",
      "videosKey": "trendingVideos",
      "layout": "grid2x5"
    },
    {
      "id": "fatal",
      "title": "Latest Releases",
      "subtitle": "Fresh content you won't find anywhere else",
      "videosKey": "fatalConnectionsVideos",
      "layout": "grid2x5"
    },
    {
      "id": "dangerous",
      "title": "Trending Now",
      "subtitle": "What everyone is watching this week",
      "videosKey": "dangerousMindsVideos",
      "layout": "grid2x5"
    },
    {
      "id": "escape",
      "title": "Dark & Intense",
      "subtitle": "Psychological thrillers and dark narratives",
      "videosKey": "escapeSeriesVideos",
      "layout": "grid2x5"
    }
  ],
  "featured": [
    {
      "videoId": "t3",
      "tag": "Featured",
      "desc": "High-stakes missions. Zero room for error."
    },
    {
      "videoId": "t1",
      "tag": "Crime Thriller",
      "desc": "A gripping investigation unfolds with deadly consequences."
    },
    {
      "videoId": "t4",
      "tag": "Mystery",
      "desc": "A witness vanishes. The truth won't stay buried."
    },
    {
      "videoId": "t9",
      "tag": "Action",
      "desc": "One shot. One chance. No second takes."
    },
    {
      "videoId": "t10",
      "tag": "Thriller",
      "desc": "Classified files surface with deadly consequences."
    }
  ]
};

CHALCHITRA.CDN = CONTENT_CDN;
CHALCHITRA.LOCAL_THUMBS = LOCAL_THUMBS;
CHALCHITRA.videoUrl = videoUrl;
CHALCHITRA.thumbUrl = thumbUrl;

export { videoUrl, thumbUrl, CONTENT_CDN };
