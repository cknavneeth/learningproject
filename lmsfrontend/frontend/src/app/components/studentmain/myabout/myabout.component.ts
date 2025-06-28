// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-myabout',
//   imports: [],
//   templateUrl: './myabout.component.html',
//   styleUrl: './myabout.component.scss'
// })
// export class MyaboutComponent {

// }
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { trigger, transition, style, animate, stagger, query } from '@angular/animations';

@Component({
  selector: 'app-myabout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './myabout.component.html',
  styleUrls: ['./myabout.component.scss'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('0.6s ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('staggerFadeIn', [
      transition('* => *', [
        query(':enter', [
          style({ opacity: 0, transform: 'translateY(30px)' }),
          stagger('100ms', [
            animate('0.6s ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ], { optional: true })
      ])
    ])
  ]
})
export class MyaboutComponent implements OnInit {
  // Keep the rest of the component code the same
  // ...
  stats = [
    { value: '10M+', label: 'Active Learners' },
    { value: '500+', label: 'Courses' },
    { value: '40+', label: 'Countries' },
    { value: '95%', label: 'Satisfaction Rate' }
  ];

  values = [
    { 
      icon: 'school', 
      title: 'Accessibility', 
      description: 'We believe education should be accessible to everyone, regardless of location or background.' 
    },
    { 
      icon: 'psychology', 
      title: 'Innovation', 
      description: 'We constantly explore new technologies and methodologies to enhance the learning experience.' 
    },
    { 
      icon: 'diversity_3', 
      title: 'Inclusivity', 
      description: 'We create content that respects and celebrates diverse perspectives and learning styles.' 
    },
    { 
      icon: 'workspace_premium', 
      title: 'Excellence', 
      description: 'We are committed to the highest standards of educational quality and user experience.' 
    }
  ];

  milestones = [
    {
      year: '2018',
      title: 'Foundation',
      description: 'ScholarSync was founded with a mission to transform online education.'
    },
    {
      year: '2019',
      title: 'First Platform Launch',
      description: 'Our initial learning platform was released with 50 courses and 10,000 users.'
    },
    {
      year: '2020',
      title: 'Global Expansion',
      description: 'Expanded to 20 countries and introduced multilingual support.'
    },
    {
      year: '2021',
      title: 'AI Integration',
      description: 'Implemented adaptive learning algorithms to personalize the educational experience.'
    },
    {
      year: '2022',
      title: 'Mobile App Launch',
      description: 'Released our mobile application, making learning accessible anywhere, anytime.'
    },
    {
      year: '2023',
      title: 'Enterprise Solutions',
      description: 'Launched corporate training programs for businesses and organizations.'
    }
  ];

  teamMembers = [
    {
      name: 'Sarah Johnson',
      role: 'CEO & Co-Founder',
      bio: 'Former educator with 15 years of experience in educational technology.',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      social: {
        linkedin: 'https://linkedin.com',
        twitter: 'https://twitter.com',
        github: null,
        dribbble: null
      }
    },
     {
      name: 'Michael Chen',
      role: 'CTO & Co-Founder',
      bio: 'AI specialist with a passion for creating intelligent learning systems.',
      image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      social: {
        linkedin: 'https://linkedin.com',
        twitter: null,
        github: 'https://github.com',
        dribbble: null
      }
    },
    {
    name: 'Saniya jos',
    role: 'Chief of Strategic Partnership and selling',
    bio: 'Award-winning actor and business strategist focused on expanding educational outreach.',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    social: {
      linkedin: 'https://linkedin.com/in/mohanlal',
      twitter: 'https://twitter.com/mohanlal',
      github: null,
      dribbble: null
    }
  },
   {
    name: 'emiliana martinex',
    role: 'Lead Designer',
    bio: 'UI/UX enthusiast committed to creating intuitive Learning interfaces.',
    image: 'https://images.unsplash.com/photo-1554151228-14d9def656e4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    social: {
      linkedin: 'https://linkedin.com',
      twitter: null,
      github: null,
      dribbble: 'https://dribbble.com'
    }
  },
  {
  name: 'Sreya',
  role: 'Chief of Strategic Partnership and Selling',
  bio: 'Award-winning actor and business strategist focused on expanding educational outreach.',
  image: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
  social: {
    linkedin: 'https://linkedin.com/in/mohanlal',
    twitter: 'https://twitter.com/mohanlal',
    github: null,
    dribbble: null
  }
}

  ]
  ngOnInit(): void {
      
  }
}