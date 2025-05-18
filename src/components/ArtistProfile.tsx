import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  AlertCircle,
  Instagram,
  Twitter,
  Linkedin,
  Mail,
  Send,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ArtistProfileProps {
  name?: string;
  bio?: string;
  avatarUrl?: string;
  socialLinks?: {
    instagram?: string;
    twitter?: string;
    linkedin?: string;
    email?: string;
  };
}

const ArtistProfile = ({
  name = "Carls Dale Escalo",
  bio = "Digital illustrator ",
  avatarUrl = "https://api.dicebear.com/7.x/avataaars/svg?seed=artist",
  socialLinks = {
    instagram: "https://instagram.com/janeartista",
    twitter: "https://twitter.com/janeartista",
    linkedin: "https://linkedin.com/in/janeartista",
    email: "jane@artistadigital.com",
  },
}: ArtistProfileProps) => {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formError, setFormError] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Basic validation
    if (!formState.name || !formState.email || !formState.message) {
      setFormError(true);
      return;
    }

    // In a real app, you would send the form data to a server here
    console.log("Form submitted:", formState);
    setFormSubmitted(true);
    setFormError(false);
    setFormState({ name: "", email: "", message: "" });
  };

  return (
    <div className="w-full bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Artist Bio Section */}
        <Card className="mb-12 overflow-hidden">
          <CardContent className="p-0">
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/3 bg-muted p-8 flex flex-col items-center justify-center">
                <Avatar className="h-40 w-40 mb-6">
                  <AvatarImage src={avatarUrl} alt={name} />
                  <AvatarFallback>{name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex space-x-4 mt-4">
                  {socialLinks.instagram && (
                    <a
                      href={socialLinks.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Instagram"
                    >
                      <Instagram className="h-5 w-5 text-muted-foreground hover:text-primary" />
                    </a>
                  )}
                  {socialLinks.twitter && (
                    <a
                      href={socialLinks.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Twitter"
                    >
                      <Twitter className="h-5 w-5 text-muted-foreground hover:text-primary" />
                    </a>
                  )}
                  {socialLinks.linkedin && (
                    <a
                      href={socialLinks.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="LinkedIn"
                    >
                      <Linkedin className="h-5 w-5 text-muted-foreground hover:text-primary" />
                    </a>
                  )}
                  {socialLinks.email && (
                    <a href={`mailto:${socialLinks.email}`} aria-label="Email">
                      <Mail className="h-5 w-5 text-muted-foreground hover:text-primary" />
                    </a>
                  )}
                </div>
              </div>
              <div className="md:w-2/3 p-8">
                <h2 className="text-3xl font-bold mb-4">{name}</h2>
                <p className="text-muted-foreground mb-6">{bio}</p>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium">Specialties</h3>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                        Character Design
                      </span>
                      <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                        Environment Art
                      </span>
                      <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                        Concept Art
                      </span>
                      <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                        Digital Painting
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Separator className="my-12" />

        {/* Contact Form Section */}
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-6 text-center">Get In Touch</h2>
          <p className="text-muted-foreground mb-8 text-center">
            Interested in commissioning artwork or have a project in mind? Send
            me a message and I'll get back to you soon.
          </p>

          {formSubmitted && (
            <Alert className="mb-6 bg-green-50 border-green-200">
              <AlertDescription className="text-green-800">
                Thank you for your message! I'll get back to you as soon as
                possible.
              </AlertDescription>
            </Alert>
          )}

          {formError && (
            <Alert className="mb-6 bg-destructive/10 border-destructive/20">
              <AlertCircle className="h-4 w-4 text-destructive" />
              <AlertDescription className="text-destructive ml-2">
                Please fill out all fields before submitting.
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="Your name"
                value={formState.name}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Your email address"
                value={formState.email}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                name="message"
                placeholder="Tell me about your project or inquiry"
                rows={5}
                value={formState.message}
                onChange={handleInputChange}
              />
            </div>
            <Button type="submit" className="w-full">
              <Send className="mr-2 h-4 w-4" /> Send Message
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ArtistProfile;
