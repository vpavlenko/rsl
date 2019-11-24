import axios from 'axios';

export default async function SearchExtension(query) {
    const videos = [];
    const response = await axios('/manifest.json');
    const dict_names = response.data.dictionaries;

    dict_names.forEach(async file => {
        await axios(`/dictionaries/${file}`)
            .then(resp => {
                const video = resp.data.filter(d => d.word === query);
                if (video.length > 0) {
                    let videoVariants = video[0].variants[0];
                    let link = `https://www.youtube.com/embed/${videoVariants.video.split('v=')[1]}?start=${videoVariants.start}&end=${videoVariants.end}&rel=0&loop=1&controls=0&showinfo=0`;
                    videos.push(link);
                }
            });
    });
    return {title: query, videos: videos};
}