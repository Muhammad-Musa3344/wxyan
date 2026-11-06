import { NestFactory } from '@nestjs/core';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { AppModule } from '../app.module';
import { Person, PersonDocument } from '../people/schemas/person.schema';
import { Site, SiteDocument } from '../sites/schemas/site.schema';

const authors = [
  {
    name: 'Ayesha Khan',
    email: 'ayesha@example.com',
    bio: 'Science writer exploring technology, research, and the natural world.',
  },
  {
    name: 'Hamza Ali',
    email: 'hamza@example.com',
    bio: 'Technology journalist interested in software, startups, and digital culture.',
  },
  {
    name: 'Sara Ahmed',
    email: 'sara@example.com',
    bio: 'Historian and environmental researcher documenting our changing world.',
  },
];

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);

  try {
    const peopleModel = app.get<Model<PersonDocument>>(
      getModelToken(Person.name),
    );

    const sitesModel = app.get<Model<SiteDocument>>(
      getModelToken(Site.name),
    );

    const authorIds: Record<string, PersonDocument['_id']> = {};

    for (const author of authors) {
      const savedAuthor = await peopleModel.findOneAndUpdate(
        { email: author.email },
        { $set: author },
        { upsert: true, new: true, setDefaultsOnInsert: true },
      );

      authorIds[author.email] = savedAuthor._id;
    }

    const websites = [
      {
        address: 'http://wonderweb.local/',
        title: 'WonderWeb — Explore the Digital World',
        author: 'ayesha@example.com',
        html: `<h1>Welcome to WonderWeb</h1>
<p>WonderWeb is an independent knowledge portal connecting curious readers with science, history, technology, and the environment.</p>
<p>Our mission is to make reliable information accessible through thoughtful articles and practical explanations. Every subject connects to another, because learning is an interconnected journey.</p>
<h2>Explore our sections</h2>
<ul>
<li><a href="http://wonderweb.local/science">Science and Discovery</a></li>
<li><a href="http://pixeljournal.local/">Pixel Journal</a></li>
<li><a href="http://historyhub.local/">History Hub</a></li>
<li><a href="http://greenplanet.local/">Green Planet</a></li>
<li><a href="http://techcorner.local/">Tech Corner</a></li>
</ul>
<p>Start exploring and follow the links to discover more.</p>`,
      },
      {
        address: 'http://wonderweb.local/science',
        title: 'Science and Discovery',
        author: 'ayesha@example.com',
        html: `<h1>Science and Discovery</h1>
<p>Scientific progress begins with questions. Researchers observe the world, develop hypotheses, conduct experiments, and share evidence with the wider community.</p>
<h2>Artificial Intelligence</h2>
<p>Artificial intelligence helps computers identify patterns, understand language, and assist people with complex tasks. Modern research combines machine learning, data, and computing power.</p>
<p>Read about computing at <a href="http://techcorner.local/">Tech Corner</a> or explore the history of scientific ideas at <a href="http://historyhub.local/">History Hub</a>.</p>
<p>More environmental research is available at <a href="http://greenplanet.local/climate">Green Planet's climate section</a>.</p>`,
      },
      {
        address: 'http://pixeljournal.local/',
        title: 'Pixel Journal — Digital Creativity',
        author: 'hamza@example.com',
        html: `<h1>Pixel Journal</h1>
<p>Pixel Journal covers digital creativity, photography, design, and the changing relationship between people and technology.</p>
<h2>How digital media changed communication</h2>
<p>Digital publishing allows independent writers to reach global audiences. Images, video, interactive stories, and accessible websites have transformed how information is shared.</p>
<p>Explore the tools behind modern publishing at <a href="http://techcorner.local/software">Tech Corner</a>.</p>
<p>For a different perspective on creativity, visit <a href="http://historyhub.local/culture">History Hub's culture archive</a>.</p>`,
      },
      {
        address: 'http://historyhub.local/',
        title: 'History Hub — Stories of the Past',
        author: 'sara@example.com',
        html: `<h1>History Hub</h1>
<p>History helps us understand how societies change. Through documents, archaeology, oral accounts, and careful research, historians reconstruct the experiences of earlier generations.</p>
<h2>Knowledge through time</h2>
<p>Libraries and universities have preserved discoveries that shaped mathematics, medicine, astronomy, and engineering.</p>
<p>Continue your research with <a href="http://wonderweb.local/science">Science and Discovery</a>.</p>
<p>Explore how digital technology preserves historical collections at <a href="http://pixeljournal.local/">Pixel Journal</a>.</p>`,
      },
      {
        address: 'http://greenplanet.local/',
        title: 'Green Planet — Environment and Nature',
        author: 'sara@example.com',
        html: `<h1>Green Planet</h1>
<p>Green Planet shares accessible research about biodiversity, conservation, renewable energy, and climate change.</p>
<h2>Protecting biodiversity</h2>
<p>Healthy ecosystems support food production, clean water, pollination, and climate stability. Conservation requires scientific research and cooperation between communities.</p>
<p>Read our <a href="http://greenplanet.local/climate">climate research article</a>.</p>
<p>Learn about scientific methods at <a href="http://wonderweb.local/science">WonderWeb Science</a>.</p>`,
      },
      {
        address: 'http://techcorner.local/',
        title: 'Tech Corner — Technology Explained',
        author: 'hamza@example.com',
        html: `<h1>Tech Corner</h1>
<p>Tech Corner explains software development, computing, cybersecurity, cloud infrastructure, and emerging technologies.</p>
<h2>The modern web</h2>
<p>Web applications commonly use frontend interfaces, backend services, databases, and APIs. These components communicate to deliver useful digital experiences.</p>
<p>Explore our <a href="http://techcorner.local/software">software development guide</a>.</p>
<p>Discover AI research at <a href="http://wonderweb.local/science">WonderWeb Science</a>.</p>
<p>Read about digital publishing at <a href="http://pixeljournal.local/">Pixel Journal</a>.</p>`,
      },
      {
        address: 'http://techcorner.local/software',
        title: 'Software Development Guide',
        author: 'hamza@example.com',
        html: `<h1>Software Development Guide</h1>
<p>Reliable software is built through planning, implementation, testing, and maintenance. Developers use version control to track changes and collaborate safely.</p>
<h2>Frontend and backend</h2>
<p>Frontend applications display information and respond to user actions. Backend systems process requests, enforce business rules, and communicate with databases.</p>
<p>Read about the evolution of digital communication at <a href="http://pixeljournal.local/">Pixel Journal</a>.</p>
<p>Explore the <a href="http://wonderweb.local/">WonderWeb homepage</a>.</p>`,
      },
      {
        address: 'http://greenplanet.local/climate',
        title: 'Understanding Climate Change',
        author: 'sara@example.com',
        html: `<h1>Understanding Climate Change</h1>
<p>Climate describes long-term patterns in temperature, rainfall, and weather. Human activities, especially greenhouse gas emissions, are contributing to changes in the global climate system.</p>
<h2>Research and solutions</h2>
<p>Scientists study temperature records, oceans, ice, and ecosystems to understand climate trends. Renewable energy, efficient transport, and conservation can help reduce environmental pressure.</p>
<p>Read the scientific background at <a href="http://wonderweb.local/science">WonderWeb Science</a>.</p>
<p>Learn about historical environmental changes at <a href="http://historyhub.local/">History Hub</a>.</p>`,
      },
      {
        address: 'http://historyhub.local/culture',
        title: 'Culture and Digital Heritage',
        author: 'sara@example.com',
        html: `<h1>Culture and Digital Heritage</h1>
<p>Culture includes traditions, language, art, architecture, and shared knowledge. Digital archives help preserve photographs, manuscripts, recordings, and historical documents.</p>
<h2>Preserving stories</h2>
<p>Digitization makes collections easier to search and study, while responsible preservation protects original materials and their context.</p>
<p>Explore digital storytelling at <a href="http://pixeljournal.local/">Pixel Journal</a>.</p>
<p>Learn about the technology behind digital archives at <a href="http://techcorner.local/">Tech Corner</a>.</p>`,
      },
      {
        address: 'http://wonderweb.local/research',
        title: 'Research Resources and Further Reading',
        author: 'ayesha@example.com',
        html: `<h1>Research Resources</h1>
<p>Good research involves checking sources, comparing evidence, identifying assumptions, and documenting references. Readers should distinguish established findings from opinion.</p>
<h2>Continue exploring</h2>
<ul>
<li><a href="http://wonderweb.local/science">Science and Discovery</a></li>
<li><a href="http://greenplanet.local/climate">Climate research</a></li>
<li><a href="http://techcorner.local/software">Software development</a></li>
<li><a href="http://historyhub.local/culture">Digital heritage</a></li>
</ul>
<p>Some addresses in this simulated web intentionally do not exist: <a href="http://missingarchive.local/">Missing Archive</a> and <a href="http://oldlibrary.local/records">Old Library Records</a>. They are included to test broken-page handling.</p>`,
      },
    ];

    for (const website of websites) {
      await sitesModel.findOneAndUpdate(
        { address: website.address },
        {
          $set: {
            address: website.address,
            title: website.title,
            html: website.html,
            authorId: authorIds[website.author],
          },
        },
        { upsert: true, new: true, setDefaultsOnInsert: true },
      );
    }

    console.log(`Seed complete: ${authors.length} authors and ${websites.length} websites.`);
    console.log('Broken test links: missingarchive.local and oldlibrary.local');
  } finally {
    await app.close();
  }
}

seed().catch((error: unknown) => {
  console.error('Seed failed:', error);
  process.exitCode = 1;
});