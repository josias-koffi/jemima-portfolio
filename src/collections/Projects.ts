import type { CollectionConfig } from 'payload'

import { slugField } from '../fields/slug'
import { projectEditor } from '../lib/editor'
import { revalidateAfterChange, revalidateAfterDelete } from '../lib/revalidate'

export const Projects: CollectionConfig = {
  slug: 'projects',
  labels: { singular: 'Projet', plural: 'Projets' },
  defaultSort: 'order',
  admin: {
    group: 'Contenu',
    useAsTitle: 'title',
    defaultColumns: ['title', 'order', 'client', 'year', '_status'],
    description: 'Les projets affichés sur l’accueil, dans l’ordre du champ « Position ».',
  },
  versions: { drafts: true, maxPerDoc: 20 },
  access: {
    // Le public ne voit que les projets publiés ; l'admin voit aussi les brouillons.
    read: ({ req }) => (req.user ? true : { _status: { equals: 'published' } }),
  },
  hooks: {
    afterChange: [revalidateAfterChange('projects')],
    afterDelete: [revalidateAfterDelete('projects')],
  },
  fields: [
    { name: 'title', label: 'Titre', type: 'text', required: true },
    slugField(),
    {
      name: 'order',
      label: 'Position dans la liste',
      type: 'number',
      required: true,
      defaultValue: 99,
      admin: { position: 'sidebar', description: '1 = premier projet affiché.' },
    },
    {
      name: 'tone',
      label: 'Couleur du bloc si pas d’image',
      type: 'select',
      defaultValue: 'accent',
      options: [
        { label: 'Bordeaux', value: 'accent' },
        { label: 'Encre (noir)', value: 'ink' },
        { label: 'Sable', value: 'sand' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      type: 'row',
      fields: [
        { name: 'client', label: 'Client', type: 'text' },
        { name: 'year', label: 'Année', type: 'text', admin: { description: 'Ex. 2024 – 2026' } },
      ],
    },
    {
      name: 'tagline',
      label: 'Phrase d’accroche',
      type: 'textarea',
      admin: { description: 'Une phrase, affichée dans la liste et en haut de la page projet.' },
    },
    { name: 'role', label: 'Mon rôle', type: 'text' },
    {
      name: 'expertises',
      label: 'Expertises',
      type: 'array',
      labels: { singular: 'Expertise', plural: 'Expertises' },
      admin: { description: 'La première est affichée dans la liste de l’accueil.' },
      fields: [{ name: 'label', label: 'Expertise', type: 'text', required: true }],
    },
    {
      type: 'row',
      fields: [
        { name: 'cover', label: 'Image de couverture', type: 'upload', relationTo: 'media' },
        {
          name: 'coverAlt',
          label: 'Description de la couverture',
          type: 'text',
          admin: { description: 'Si vide : description de l’image dans la médiathèque.' },
        },
      ],
    },
    {
      name: 'caseStudy',
      label: 'Étude de cas',
      type: 'group',
      admin: {
        description:
          'Affichée en 4 chapitres sous la couverture : Le défi → La stratégie → Réalisations → Impact. Un chapitre vide est masqué.',
      },
      fields: [
        { name: 'challenge', label: 'Le défi (contexte)', type: 'textarea' },
        {
          name: 'strategy',
          label: 'La stratégie',
          type: 'array',
          labels: { singular: 'Point', plural: 'Points' },
          fields: [{ name: 'text', label: 'Texte', type: 'textarea', required: true }],
        },
        {
          name: 'deliverables',
          label: 'Réalisations',
          type: 'array',
          labels: { singular: 'Réalisation', plural: 'Réalisations' },
          fields: [{ name: 'text', label: 'Texte', type: 'textarea', required: true }],
        },
        {
          name: 'impact',
          label: 'Impact / résultats',
          type: 'array',
          labels: { singular: 'Résultat', plural: 'Résultats' },
          admin: { description: 'Idéalement chiffré : abonnés gagnés, participants, portée…' },
          fields: [{ name: 'text', label: 'Texte', type: 'textarea', required: true }],
        },
      ],
    },
    {
      name: 'content',
      label: 'Texte du projet (détails, images, vidéos)',
      type: 'richText',
      editor: projectEditor,
      admin: {
        description:
          'Titres, paragraphes, listes. Bouton « + » ou « / » : insérer une image/vidéo de la médiathèque ou une vidéo YouTube entre deux paragraphes.',
      },
    },
    {
      name: 'gallery',
      label: 'Galerie (en bas de page)',
      type: 'array',
      labels: { singular: 'Image', plural: 'Images' },
      fields: [
        { name: 'media', label: 'Image', type: 'upload', relationTo: 'media', required: true },
        { name: 'caption', label: 'Légende', type: 'text' },
        { name: 'wide', label: 'Pleine largeur', type: 'checkbox', defaultValue: false },
      ],
    },
    {
      name: 'links',
      label: 'Liens',
      type: 'array',
      labels: { singular: 'Lien', plural: 'Liens' },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'label', label: 'Texte du bouton', type: 'text', required: true },
            { name: 'url', label: 'Adresse', type: 'text', required: true },
          ],
        },
      ],
    },
  ],
}
