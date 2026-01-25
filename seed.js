import mongoose from "mongoose";
import dotenv from "dotenv";
import portfolio from "./models/portfolio.js";

dotenv.config();

await mongoose.connect(process.env.MONGODB_URI);

const data = [
  {
    author: {
      name: "Magdaleno Aguilar Zamora",
      image: "https://live.staticflickr.com/65535/55055541203_0fed7cd1e9_c.jpg"
    },
    book: {
      title: "El Colega",
      image: "https://live.staticflickr.com/65535/55047420893_5f37a8a18c_h.jpg",
      genre: "Cuento/Drama"
    }
  },
  {
    author: {
      name: "Sociedad de Escritores de Ciudad Juárez",
      image: "https://live.staticflickr.com/65535/55047420883_c405456659_z.jpg"
    },
    book: {
      title: "Tras las Huellas de la Historia Chihuahuense – Antología 2024",
      image: "https://live.staticflickr.com/65535/55047420873_5f26ebd212_h.jpg",
      genre: "Poesía/Cuento/Historia"
    }
  },
  {
    author: {
      name: "Cecy Leyva",
      image: "https://live.staticflickr.com/65535/55047497704_0ef7d8bcc2_h.jpg"
    },
    book: {
      title: "La Canción Ranchera",
      image: "https://live.staticflickr.com/65535/55047575965_4535629c43_h.jpg",
      genre: "Histórico/Cultural"
    }
  },
  {
    author: {
      name: "Jesús Arturo Gardea",
      image: "https://live.staticflickr.com/65535/55047619472_f83188a4e4_b.jpg"
    },
    book: {
      title: "Santi",
      image: "https://live.staticflickr.com/65535/55046338667_ca3aee83b7_n.jpg",
      genre: "Cuento infantil"
    }
  },
  {
    author: {
      name: "Raúl E. Ruiz Hernández",
      image: "https://live.staticflickr.com/65535/55047531069_f0a69d7c7a_b.jpg"
    },
    book: {
      title: "El Renacimiento de Tenochtitlán - Los Guerreros del Quinto Sol",
      image: "https://live.staticflickr.com/65535/55046338947_e43c22e177_b.jpg",
      genre: "Histórico/Drama"
    }
  },
  {
    author: {
      name: "Raúl E. Ruiz Hernández",
      image: "https://live.staticflickr.com/65535/55047608325_4d5134c9e8_b.jpg"
    },
    book: {
      title: "Caretta",
      image: "https://live.staticflickr.com/65535/55047421213_e8b141efb6_b.jpg",
      genre: "Drama Juvenil"
    }
  }
];

await portfolio.insertMany(data);
console.log("Portafolio cargado 🚀");

process.exit();